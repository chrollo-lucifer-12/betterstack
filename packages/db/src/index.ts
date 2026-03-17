import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { regions, statusEnum, websites, websiteTicks } from "./db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export * from "drizzle-orm";

export const db = drizzle(pool);

export const websiteSelectSchema = createSelectSchema(websites);
export const regionSelectSchema = createSelectSchema(regions);
export const websiteTickSelectSchema = createSelectSchema(websiteTicks);
export const statusSelectSchema = createSelectSchema(statusEnum);

export const websiteInsertSchema = createInsertSchema(websites);
export const regionInsertSchema = createInsertSchema(regions);
export const websiteTickInsertSchema = createInsertSchema(websiteTicks);

export const websiteUpdateSchema = createUpdateSchema(websites);
export const regionUpdateSchema = createUpdateSchema(regions);
export const websiteTickUpdateSchema = createUpdateSchema(websiteTicks);
