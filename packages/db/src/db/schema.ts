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
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),

  image: text("image"),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  token: text("token").notNull().unique(),

  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),

    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),

    tokenType: text("token_type"),
    scope: text("scope"),

    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  }),
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.identifier, table.token],
    }),
  }),
);

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
    userId: uuid("user_id")
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
