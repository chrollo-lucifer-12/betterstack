import { RedisClient } from "bun";

type KVTuple = [key: string, value: string, ...rest: string[]];
type StreamEntry = [id: string, fields: KVTuple];
type XReadGroupResult = StreamEntry[];

async function main() {
  while (1) {
    const client = new RedisClient(process.env.REDIS_URL);

    const res = await client.send("xreadgroup", [
      "group",
      process.env.REGION!,
      "india-1",
      "count",
      "10",
      "streams",
      "betterstack:websites",
      ">",
    ]);

    const entries = res["betterstack:websites"] as XReadGroupResult;
    for (let entry of entries) {
      console.log(entry[0]);
    }

    client.close();
  }
}

main().catch((err) => console.error(err));
