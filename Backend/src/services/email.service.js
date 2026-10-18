import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from: `"ResuMatch AI" <${process.env.SMTP_USER}>`,
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
}