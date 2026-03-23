import * as brevo from "@getbrevo/brevo";

const brevoInstance = new brevo.BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

export const sendEmail = async (
  htmlContent: string,
  email: string,
  name: string,
  subject: string,
) => {
  await brevoInstance.transactionalEmails.sendTransacEmail({
    htmlContent,
    subject,
    sender: {
      email: "sahilpython@gmail.com",
      name: "sahil",
    },
    to: [
      {
        email: email,
        name: name,
      },
    ],
  });
};
