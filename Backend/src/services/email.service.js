import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 2525),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

export async function sendOtpEmail(email, otp) {
  try {
    await transporter.sendMail({
      from: `"ResuMatch AI" <${process.env.SMTP_FROM}>`,
      to: email,
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

    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", {
      code: error.code,
      message: error.message,
    });
    throw error;
  }
}
