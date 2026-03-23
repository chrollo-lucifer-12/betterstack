import { RedisClient } from "bun";
import { db, gt } from "@repo/db";
import { websites } from "@repo/db/schema";

let lastId: string | undefined = undefined;
const client = new RedisClient(process.env.REDIS_URL!);

async function startRedis() {
  const query = db
    .select({ id: websites.id, url: websites.url })
    .from(websites);

  const allWebsites = lastId
    ? await query.where(gt(websites.id, lastId))
    : await query;

  if (!allWebsites || allWebsites.length === 0) {
    console.log("No new websites");
    return;
  }

  const pipeline: Promise<any>[] = [];

  for (const w of allWebsites) {
    pipeline.push(
      client.send("xadd", [
        "betterstack:websites",
        "*",
        "id",
        w.id,
        "url",
        w.url,
      ]),
    );
  }

  await Promise.all(pipeline);

  lastId = allWebsites[allWebsites.length - 1]?.id;

  console.log(`Pushed ${allWebsites.length} websites`);
}

startRedis();

setInterval(
  () => {
    startRedis().catch((err) => console.error(err));
  },
  1000 * 60 * 3,
);
