import { db } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { brevoInstance } from "./brevo";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
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
      await brevoInstance.transactionalEmails.sendTransacEmail({
        htmlContent: `<a href="${url}">Click here to verify your email</a>`,
        subject: "Email Verification",
        sender: {
          email: "sahilpython@gmail.com",
          name: "sahil",
        },
        to: [
          {
            email: user.email,
            name: user.name,
          },
        ],
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  basePath: "/api",
});
