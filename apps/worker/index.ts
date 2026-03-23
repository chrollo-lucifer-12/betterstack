import { RedisClient } from "bun";
import { db, eq } from "@repo/db";
import { regions, websiteTicks } from "@repo/db/schema";

type RedisStream = Record<string, [string, string[]][]>;

async function main() {
  const region = process.env.REGION!;

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

  const res = (await client.send("xreadgroup", [
    "group",
    region,
    "india-1",
    "count",
    "10",
    "streams",
    "betterstack:websites",
    ">",
  ])) as RedisStream | null;
  if (!res) return;

  const stream = res["betterstack:websites"];

  if (!stream || stream.length === 0) {
    console.log("No messages");
    client.close();
    return;
  }

  for (const [id, fields] of stream) {
    const obj = Object.fromEntries(
      fields.reduce<[string, string][]>((acc, _, i) => {
        if (i % 2 === 0) acc.push([fields[i]!, fields[i + 1]!]);
        return acc;
      }, []),
    );

    if (obj.websites) {
      const websites: { id: string; url: string }[] = JSON.parse(obj.websites);

      const timestamp = id.split("-")[0];
      for (const site of websites) {
        const start = performance.now();
        const res = await fetch(site.url);
        const responseTime = performance.now() - start;

        const status = res.ok ? "UP" : "DOWN";

        console.log(site.url, status);

        await db.insert(websiteTicks).values({
          regionId: regionRow.id,
          websiteId: site.id,
          created_at: new Date(Number(timestamp!)),
          status,
          responseTimeMs: Math.round(responseTime),
        });
      }
    }
  }

  client.close();
}

main().catch(console.error);
