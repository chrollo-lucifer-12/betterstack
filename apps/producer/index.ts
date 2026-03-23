import { RedisClient } from "bun";
import { db, gt } from "@repo/db";
import { websites } from "@repo/db/schema";

const REDIS_LAST_ID_KEY = "betterstack:last_id";
const REDIS_STREAM_KEY = "betterstack:websites";
const STREAM_MAX_LEN = 10_000;
const INTERVAL_MS = 1000 * 60 * 3;

const client = new RedisClient(process.env.REDIS_URL!);

async function getLastId(): Promise<string | null> {
  return client.get(REDIS_LAST_ID_KEY);
}

async function setLastId(id: Date): Promise<void> {
  await client.set(REDIS_LAST_ID_KEY, id.toDateString());
}

async function startRedis() {
  let lastId: string | null = null;

  try {
    lastId = await getLastId();
  } catch (err) {
    console.error(
      "Failed to fetch lastId from Redis, defaulting to null:",
      err,
    );
  }

  let allWebsites: { id: string; url: string; createdAt: Date }[];

  try {
    const query = db
      .select({
        id: websites.id,
        url: websites.url,
        createdAt: websites.created_at,
      })
      .from(websites)
      .orderBy(websites.created_at);

    allWebsites = lastId
      ? await query.where(gt(websites.created_at, new Date(lastId)))
      : await query;
  } catch (err) {
    console.error("Failed to query websites from DB:", err);
    return;
  }

  if (!allWebsites || allWebsites.length === 0) {
    console.log("No new websites");
    return;
  }

  const failed: string[] = [];

  const pipeline = allWebsites.map((w) =>
    client
      .send("xadd", [
        REDIS_STREAM_KEY,
        "MAXLEN",
        "~",
        String(STREAM_MAX_LEN),
        "*",
        "id",
        w.id,
        "url",
        w.url,
      ])
      .catch((err) => {
        console.error(`Failed to push website ${w.id}:`, err);
        failed.push(w.id);
      }),
  );

  await Promise.all(pipeline);

  if (failed.length > 0) {
    console.warn(`${failed.length} websites failed to push:`, failed);
  }

  const successCount = allWebsites.length - failed.length;
  if (successCount > 0) {
    const lastWebsite = allWebsites[allWebsites.length - 1];
    try {
      await setLastId(lastWebsite?.createdAt!);
      console.log(
        `Pushed ${successCount} websites. Last createdAt: ${lastWebsite?.createdAt}`,
      );
    } catch (err) {
      console.error("Failed to persist lastId to Redis:", err);
    }
  }
}

async function run() {
  let running = false;

  async function tick() {
    if (running) {
      console.warn("Previous run still in progress, skipping tick");
      return;
    }
    running = true;
    try {
      await startRedis();
    } catch (err) {
      console.error("Unexpected error in startRedis:", err);
    } finally {
      running = false;
    }
  }

  await tick();
  setInterval(tick, INTERVAL_MS);
}

run();
