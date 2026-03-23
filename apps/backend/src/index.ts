import { Elysia, t } from "elysia";
import { authController } from "./modules/auth";
import { cors } from "@elysiajs/cors";
import { websiteController } from "./modules/website";
import { env } from "./lib/env";

const app = new Elysia()
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(authController)
  .use(websiteController);

export default app;
