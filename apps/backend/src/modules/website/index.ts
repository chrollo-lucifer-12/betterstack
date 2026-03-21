import Elysia from "elysia";
import { auth } from "../../lib/auth";
import {
  createWebsiteAndMap,
  deleteWebsite,
  getWebsiteStatus,
} from "./services";
import { websiteModel } from "./models";

export const websiteController = new Elysia({
  name: "website",
  prefix: "/website",
})
  .derive(async ({ request: { headers }, status }) => {
    const session = await auth.api.getSession({ headers });

    if (!session) {
      return status(401, { message: "Unauthorized" });
    }

    return {
      user: session.user,
      session: session.session,
    };
  })
  .get(
    "/status/:websiteId",
    async ({
      status,
      params: { websiteId },
      query: { endTime, region, startTime },
    }) => {
      const { error, result } = await getWebsiteStatus(
        websiteId,
        region,
        startTime,
        endTime,
      );
      if (error) {
        throw status(500, "Internal Server Error");
      }

      return status(200, result);
    },
    {
      params: websiteModel.getStatusParams,
      query: websiteModel.getStatusQuery,
      response: {
        200: websiteModel.getStatusResponse,
        500: websiteModel.getStatusInvalid,
      },
    },
  )
  .post(
    "/create",
    async ({ status, body: { url }, user: { id } }) => {
      const { error, websiteId } = await createWebsiteAndMap(url, id);

      if (error) {
        throw status(500, "Internal Server Error");
      }

      return status(201, { websiteId });
    },
    {
      body: websiteModel.createWebsiteBody,
      response: {
        201: websiteModel.createWebsiteResponse,
        500: websiteModel.createWebsiteInvalid,
      },
    },
  )
  .delete(
    "/delete/:websiteId",
    async ({ params: { websiteId }, status, user: { id } }) => {
      const { error } = await deleteWebsite(id, websiteId);

      if (error) {
        throw status(500, "Internal Server Error");
      }

      return status(204, {});
    },
    {
      auth: true,
      params: websiteModel.deleteWebsiteParams,
      response: {
        204: websiteModel.deleteWebsiteResponse,
        500: websiteModel.deleteWebsiteInvalid,
      },
    },
  );
