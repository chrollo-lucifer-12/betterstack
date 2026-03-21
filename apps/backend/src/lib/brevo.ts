import * as brevo from "@getbrevo/brevo";
import { env } from "./env";

export const brevoInstance = new brevo.BrevoClient({
  apiKey: env.BREVO_API_KEY,
});
