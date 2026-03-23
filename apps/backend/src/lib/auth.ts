import { db } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "./env";
import { sendEmail } from "@repo/mail/brevo";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
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
