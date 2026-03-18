import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

const timestamps = {
  updated_at: timestamp().defaultNow().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};
const id = {
  id: uuid("id").defaultRandom().primaryKey(),
};

export const statusEnum = pgEnum("status", ["UP", "DOWN", "UNKNOWN"]);

export const users = pgTable("users", {
  id: t.text("id").primaryKey(),
  name: t.text("name").notNull(),
  email: t.varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: t.boolean("email_verified").notNull(),
  image: t.text("image"),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull(),
  updatedAt: t
    .timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull(),
});

export const sessions = pgTable("sessions", {
  id: t.text("id").primaryKey(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: t.varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: t
    .timestamp("expires_at", { precision: 6, withTimezone: true })
    .notNull(),
  ipAddress: t.text("ip_address"),
  userAgent: t.text("user_agent"),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull(),
  updatedAt: t
    .timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull(),
});

export const accounts = pgTable("accounts", {
  id: t.text("id").primaryKey(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: t.text("account_id").notNull(),
  providerId: t.text("provider_id").notNull(),
  accessToken: t.text("access_token"),
  refreshToken: t.text("refresh_token"),
  accessTokenExpiresAt: t.timestamp("access_token_expires_at", {
    precision: 6,
    withTimezone: true,
  }),
  refreshTokenExpiresAt: t.timestamp("refresh_token_expires_at", {
    precision: 6,
    withTimezone: true,
  }),
  scope: t.text("scope"),
  idToken: t.text("id_token"),
  password: t.text("password"),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull(),
  updatedAt: t
    .timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull(),
});

export const verifications = pgTable("verifications", {
  id: t.text("id").primaryKey(),
  identifier: t.text("identifier").notNull(),
  value: t.text("value").notNull(),
  expiresAt: t
    .timestamp("expires_at", { precision: 6, withTimezone: true })
    .notNull(),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull(),
  updatedAt: t
    .timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull(),
});
export const websites = pgTable("websites", {
  ...id,
  ...timestamps,
  url: varchar("url").unique().notNull(),
});

export const websiteToUser = pgTable(
  "websites_to_user",
  {
    websiteId: uuid("website_id")
      .references(() => websites.id)
      .notNull(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.websiteId, table.userId],
    }),
  }),
);

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
