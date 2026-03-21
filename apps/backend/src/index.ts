import { Elysia, t } from "elysia";
import { authController } from "./modules/auth";
import swagger from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { websiteController } from "./modules/website";

export const app = new Elysia()
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(swagger())
  .use(authController)
  .use(websiteController)
  .listen(process.env.PORT!);

console.log(app.routes.map((r) => r.path));

console.log(`Server running on ${app.server?.hostname}:${app.server?.port}`);
