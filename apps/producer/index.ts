import { RedisClient } from "bun";
import { db } from "@repo/db";
import { websites } from "@repo/db/schema";

async function startRedis() {
  const allWebsites = await db.select().from(websites);

  const client = new RedisClient(process.env.REDIS_URL!);

  const res = await client.send("xadd", [
    "betterstack:websites",
    "*",
    "websites",
    JSON.stringify(
      allWebsites.map((w) => {
        return {
          id: w.id,
          url: w.url,
        };
      }),
    ),
  ]);

  console.log(res);

  client.close();
}

startRedis();

setInterval(
  () => {
    startRedis().catch((err) => console.error(err));
  },
  1000 * 60 * 3,
);
