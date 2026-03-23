import { RedisClient } from "bun";
import { db, eq, inArray } from "@repo/db";
import { users, websites, websiteToUser } from "@repo/db/schema";
import { sendEmail } from "@repo/mail/brevo";

const client = new RedisClient(process.env.REDIS_URL!);

const BATCH_SIZE = 100;

const POLL_DELAY_MS = 500;

async function batchWorker() {
  while (true) {
    const items: string[] = await client.lrange(
      "betterstack:websites:down",
      0,
      BATCH_SIZE - 1,
    );

    if (!items || items.length === 0) {
      await new Promise((r) => setTimeout(r, POLL_DELAY_MS));
      continue;
    }

    const parsed = items.map((item) => JSON.parse(item));

    const websiteIds = parsed.map((p) => p.websiteId);

    try {
      const websiteRows = await db
        .select({ id: websites.id, name: websites.url })
        .from(websites)
        .where(inArray(websites.id, websiteIds));

      const websiteMap = Object.fromEntries(
        websiteRows.map((w) => [w.id, w.name]),
      );

      const userRows = await db
        .select({
          id: users.id,
          email: users.email,
          websiteId: websiteToUser.websiteId,
          name: users.name,
        })
        .from(users)
        .innerJoin(websiteToUser, eq(websiteToUser.userId, users.id))
        .where(inArray(websiteToUser.websiteId, websiteIds));

      for (const user of userRows) {
        const websiteName = websiteMap[user.websiteId];
        const statusData = parsed.find((p) => p.websiteId === user.websiteId);
        if (!statusData) continue;

        await sendEmail(
          `Website: ${websiteName}\nStatus: ${statusData.status}\nResponse Time: ${statusData.responseTime}ms`,
          user.email,
          user.name,
          `Update for ${websiteName}`,
        );
      }
    } catch (err) {
      console.error("Error processing batch:", err);
      await new Promise((r) => setTimeout(r, POLL_DELAY_MS));
      continue;
    }

    await client.ltrim("betterstack:websites:results", items.length, -1);
    console.log(`Processed batch of ${items.length} items`);
  }
}

batchWorker().catch(console.error);
