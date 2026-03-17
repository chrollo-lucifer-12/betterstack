import { relations } from "drizzle-orm";
import {
  accounts,
  regions,
  sessions,
  users,
  websites,
  websiteTicks,
} from "./schema";

export const websiteRelations = relations(websites, ({ many }) => ({
  websiteTicks: many(websiteTicks),
}));

export const regionRelations = relations(regions, ({ many }) => ({
  websiteTicks: many(websiteTicks),
}));

export const websiteTicksRelations = relations(websiteTicks, ({ one }) => ({
  website: one(websites, {
    fields: [websiteTicks.websiteId],
    references: [websites.id],
  }),
  region: one(regions, {
    fields: [websiteTicks.regionId],
    references: [regions.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));
