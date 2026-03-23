import { RedisClient } from "bun";
import { db, eq } from "@repo/db";
import { regions } from "@repo/db/schema";

type RedisStream = Record<string, [string, string[]][]>;
const region = process.env.REGION!;
const worker = `${region}-${crypto.randomUUID()}`;

let [regionRow] = await db
  .select({ id: regions.id })
  .from(regions)
  .where(eq(regions.name, region));

if (!regionRow) {
  const [newRegion] = await db
    .insert(regions)
    .values({ name: region })
    .returning({ id: regions.id });

  if (!newRegion) throw new Error(`Failed to create region: ${region}`);
  regionRow = newRegion;
}

const client = new RedisClient(process.env.REDIS_URL!);

const getStatus = async (url: string) => {
  const start = performance.now();
  const res = await fetch(url);
  const responseTime = performance.now() - start;

  const status = res.ok ? "UP" : "DOWN";
  return { status, responseTime } as const;
};

const getStatusAndInsert = async (
  url: string,
  timestamp: string,
  websiteId: string,
) => {
  const { responseTime, status } = await getStatus(url);

  console.log(url, status);

  await client.rpush(
    "betterstack:websites:results",
    JSON.stringify({
      regionId: regionRow.id,
      websiteId,
      created_at: new Date(Number(timestamp)),
      status,
      responseTimeMs: Math.round(responseTime),
    }),
  );
};

async function main() {
  console.log("Polling...");
  const res = (await client.send("xreadgroup", [
    "group",
    region,
    worker,
    "count",
    "10",
    "streams",
    "betterstack:websites",
    ">",
  ])) as RedisStream | null;
  console.log("RAW:", res);
  if (!res) {
    console.log("no streams found");
    return;
  }

  const stream = res["betterstack:websites"];

  if (!stream || stream.length === 0) {
    console.log("No messages");
    return;
  }

  await Promise.allSettled(
    stream.map(([id, fields]) => {
      const obj = Object.fromEntries(
        fields.reduce<[string, string][]>((acc, _, i) => {
          if (i % 2 === 0) acc.push([fields[i]!, fields[i + 1]!]);
          return acc;
        }, []),
      );

      if (!obj.url || !obj.id) return Promise.resolve();

      const timestamp = id.split("-")[0];

      return getStatusAndInsert(obj.url, timestamp!, obj.id).then(() =>
        client.send("xack", ["betterstack:websites", region, id]),
      );
    }),
  );
}

main().catch(console.error);
