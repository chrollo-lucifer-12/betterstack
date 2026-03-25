import { and, db, eq } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "./env";
import { sendEmail } from "@repo/mail/brevo";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { users } from "@repo/db/schema";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }
      const email = ctx.body.email;
      const [findUser] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.emailVerified, true)));
      if (findUser) {
        throw new APIError("BAD_REQUEST", {
          message: "Email already exists.",
          cause: "email",
        });
      }
    }),
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ token, url, user }) => {
      await sendEmail(
        `<a href="${url}">Click here to verify your email</a>`,
        user.email,
        user.name,
        "Email Verification",
      );
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  basePath: "/api",
});
