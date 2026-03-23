import { RedisClient } from "bun";
import { db } from "@repo/db";
import { websiteTicks } from "@repo/db/schema";

const client = new RedisClient(process.env.REDIS_URL!);

const BATCH_SIZE = 100;

const POLL_DELAY_MS = 500;

async function batchWorker() {
  while (true) {
    const items: string[] = await client.lrange(
      "betterstack:websites:results",
      0,
      BATCH_SIZE - 1,
    );

    if (!items || items.length === 0) {
      await new Promise((r) => setTimeout(r, POLL_DELAY_MS));
      continue;
    }

    const parsed = items.map((item) => {
      const data = JSON.parse(item);
      return {
        regionId: data.regionId,
        websiteId: data.websiteId,
        created_at: new Date(data.created_at),
        status: data.status,
        responseTimeMs: data.responseTimeMs,
      };
    });

    try {
      await db.insert(websiteTicks).values(parsed);
    } catch (err) {
      console.error("Failed to insert batch:", err);
      await new Promise((r) => setTimeout(r, POLL_DELAY_MS));
      continue;
    }

    await client.ltrim("betterstack:websites:results", items.length, -1);

    console.log(`Inserted batch of ${items.length} items`);
  }
}

batchWorker().catch(console.error);
