import { EmailVerification } from "@/emails/EmailVerification";
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

export async function sendOtpEmailByBrevo(
  email: string,
  otp: string,
  username: string
) {
  try {
    let emailAPI = new TransactionalEmailsApi();
    (emailAPI as any).authentications.apiKey.apiKey =
      process.env.BREVO_API_KEY!;
    const html = EmailVerification({ username, otp });

    const sendEmail: SendSmtpEmail = {
      to: [{ email, name: username }],
      sender: {
        name: "VibeChat-Pro",
        email: "shaileshwakapaijan123@gmail.com",
      },
      subject: "VibeChat-Pro | Verification Code",
      htmlContent: html,
    };
    let emailRes = await emailAPI.sendTransacEmail(sendEmail);
    console.log("Email Sent.");

    if (!emailRes.body?.messageId && !emailRes?.body.messageIds?.length) {
      return {
        success: false,
        message: "Some error in sending verification email.",
      };
    }

    return { success: true, message: "Verification email send successfully." };
  } catch (error) {
    console.log("Errorr sending verification email: ", error);
    return {
      success: false,
      message: "Some error in sending verification email.",
    };
  }
}
