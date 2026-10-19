import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email, otp) {
  try {
    const { data, error } = await resend.emails.send({
      from: "ResuMatch AI <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your ResuMatch AI account",
      text: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2>Welcome to ResuMatch AI!</h2>
          <p>Use the OTP below to verify your email address.</p>
          <h1 style="letter-spacing: 8px;">${otp}</h1>
          <p>This OTP expires in <strong>5 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      throw new Error(error.message || "Unable to send verification email.");
    }

    console.log("OTP email sent successfully:", data?.id);
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
}