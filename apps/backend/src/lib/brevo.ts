import * as brevo from "@getbrevo/brevo";

export const brevoInstance = new brevo.BrevoClient({
  apiKey: process.env.BREVO_API_KEY ?? "",
});
