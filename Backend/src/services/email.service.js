import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(email, otp) {
  try {
    await transporter.sendMail({
      from: `"ResuMatch AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your ResuMatch AI account",
      text: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
    });

    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("SMTP ERROR:", {
      code: error.code,
      command: error.command,
      message: error.message,
    });

    throw error;
  }
}

// export async function sendOtpEmail(email, otp) {
//   await transporter.sendMail({
//     from: `"ResuMatch AI" <${process.env.SMTP_USER}>`,
//     to: email,
//     subject: "Verify your ResuMatch AI account",
//     text: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
//         <h2>Welcome to ResuMatch AI!</h2>
//         <p>Use the OTP below to verify your email address.</p>
//         <h1 style="letter-spacing: 8px;">${otp}</h1>
//         <p>This OTP expires in <strong>5 minutes</strong>.</p>
//         <p>If you didn't request this, please ignore this email.</p>
//       </div>
//     `,
//   });
// }
