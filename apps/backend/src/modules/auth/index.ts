import Elysia from "elysia";
import { auth } from "../../lib/auth";

export const authController = new Elysia({ name: "better-auth" }).mount(
  "/auth",
  auth.handler,
);
