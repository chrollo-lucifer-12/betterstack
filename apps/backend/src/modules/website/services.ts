import { and, between, db, eq } from "@repo/db";
import {
  regions,
  websites,
  websiteTicks,
  websiteToUser,
} from "@repo/db/schema";
import { catchErrorTyped } from "../../lib/utils";

export const deleteWebsite = async (userId: string, websiteId: string) => {
  const [err, result] = await catchErrorTyped(
    (async () => {
      const [mapping] = await db
        .select()
        .from(websiteToUser)
        .where(
          and(
            eq(websiteToUser.userId, userId),
            eq(websiteToUser.websiteId, websiteId),
          ),
        );

      if (!mapping) {
        throw new Error("Record not found");
      }

      await db
        .delete(websiteToUser)
        .where(
          and(
            eq(websiteToUser.userId, userId),
            eq(websiteToUser.websiteId, websiteId),
          ),
        );

      return true;
    })(),
  );

  if (err) {
    return { error: err, success: false };
  }

  return { error: null, success: true };
};

export const createWebsiteAndMap = async (url: string, userId: string) => {
  const [err, result] = await catchErrorTyped(
    db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(websites)
        .values({ url })
        .onConflictDoNothing()
        .returning();

      let websiteId: string;

      if (inserted) {
        websiteId = inserted.id;
      } else {
        const [existing] = await tx
          .select()
          .from(websites)
          .where(eq(websites.url, url));

        if (!existing) throw new Error("Website fetch failed");
        websiteId = existing.id;
      }

      await tx
        .insert(websiteToUser)
        .values({
          userId,
          websiteId,
        })
        .onConflictDoNothing();

      return websiteId;
    }),
  );

  if (err) {
    return {
      websiteId: null,
      success: false,
      error: err,
    };
  }

  return {
    websiteId: result,
    success: true,
    error: null,
  };
};

export const getWebsiteStatus = async (
  websiteId: string,
  region: string,
  startTime?: Date,
  endTime?: Date,
) => {
  const [error, result] = await catchErrorTyped(
    (async () => {
      const [findRegion] = await db
        .select()
        .from(regions)
        .where(eq(regions.name, region));

      if (!findRegion) {
        throw new Error("Region not found");
      }

      const [website] = await db
        .select()
        .from(websites)
        .where(eq(websites.id, websiteId));

      if (!website) {
        throw new Error("Website not found");
      }

      const conditions = [];
      if (region) conditions.push(eq(websiteTicks.regionId, findRegion.id));
      if (startTime) {
        if (!endTime) endTime = new Date();
        conditions.push(between(websiteTicks.created_at, startTime, endTime));
      }

      const response = await db
        .select()
        .from(websiteTicks)
        .where(and(...conditions));

      if (!response) throw new Error("Error getting website status");

      return response;
    })(),
  );

  if (error) {
    return {
      error,
      result: null,
    };
  }

  return {
    error: null,
    result,
  };
};
