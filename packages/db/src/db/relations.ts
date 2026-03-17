import { relations } from "drizzle-orm";
import {
  accounts,
  regions,
  sessions,
  users,
  websites,
  websiteTicks,
  websiteToUser,
} from "./schema";

export const websiteRelations = relations(websites, ({ many, one }) => ({
  websiteTicks: many(websiteTicks),
  userLinks: many(websiteToUser),
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
  websiteLinks: many(websiteToUser),
}));

export const websiteToUserRelations = relations(websiteToUser, ({ one }) => ({
  website: one(websites, {
    fields: [websiteToUser.websiteId],
    references: [websites.id],
  }),

  user: one(users, {
    fields: [websiteToUser.userId],
    references: [users.id],
  }),
}));
