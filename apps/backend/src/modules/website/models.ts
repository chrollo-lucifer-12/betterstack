import { t, UnwrapSchema } from "elysia";

export const websiteModel = {
  createWebsiteBody: t.Object({
    url: t.String(),
  }),
  createWebsiteResponse: t.Object({
    websiteId: t.String(),
  }),
  createWebsiteInvalid: t.Literal("Internal Server Error"),
  deleteWebsiteResponse: t.Object({}),
  deleteWebsiteParams: t.Object({
    websiteId: t.String(),
  }),
  deleteWebsiteInvalid: t.Literal("Internal Server Error"),
  getStatusResponse: t.Array(
    t.Object({
      id: t.String(),
      responseTimeMs: t.Nullable(t.Number()),
      status: t.Nullable(
        t.Enum({
          UP: "UP",
          DOWN: "DOWN",
          UNKNOWN: "UNKNOWN",
        }),
      ),
      websiteId: t.String(),
      regionId: t.String(),
      created_at: t.Date(),
      updated_at: t.Date(),
      deleted_at: t.Nullable(t.Date()),
    }),
  ),
  getStatusParams: t.Object({
    websiteId: t.String(),
  }),
  getStatusQuery: t.Object({
    region: t.String(),
    startTime: t.Optional(t.String()),
    endTime: t.Optional(t.String()),
  }),
  getStatusInvalid: t.Literal("Internal Server Error"),
} as const;

export type CreateWebsiteBody = UnwrapSchema<
  typeof websiteModel.createWebsiteBody
>;
export type CreateWebsiteResponse = UnwrapSchema<
  typeof websiteModel.createWebsiteResponse
>;

export type DeleteWebsiteParams = UnwrapSchema<
  typeof websiteModel.deleteWebsiteParams
>;
export type DeleteWebsiteResponse = UnwrapSchema<
  typeof websiteModel.deleteWebsiteResponse
>;

export type GetStatusParams = UnwrapSchema<typeof websiteModel.getStatusParams>;
export type GetStatusQuery = UnwrapSchema<typeof websiteModel.getStatusQuery>;
export type GetStatusResponse = UnwrapSchema<
  typeof websiteModel.getStatusResponse
>;
