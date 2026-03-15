import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  updated_at: timestamp().defaultNow().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};
const id = {
  id: uuid("id").defaultRandom().primaryKey(),
};

export const statusEnum = pgEnum("status", ["UP", "DOWN", "UNKNOWN"]);

export const websites = pgTable("websites", {
  ...id,
  ...timestamps,
  url: varchar("url").unique().notNull(),
});

export const regions = pgTable("regions", {
  ...id,
  ...timestamps,
  name: varchar("name").unique().notNull(),
});

export const websiteTicks = pgTable("website_ticks", {
  ...id,
  ...timestamps,
  responseTimeMs: integer("response_time_ms"),
  status: statusEnum().default("UNKNOWN"),
  websiteId: uuid("website_id")
    .references(() => websites.id)
    .notNull(),
  regionId: uuid("region_id")
    .references(() => regions.id)
    .notNull(),
});
