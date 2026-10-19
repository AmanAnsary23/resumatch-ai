import "dotenv/config";
import { sendOtpEmail } from "./src/services/email.service.js";

const testEmail = "amanansary23@gmail.com";

try {
  await sendOtpEmail(testEmail, "123456");
  console.log("✅ Test email sent successfully!");
} catch (error) {
  console.error("❌ Email failed:", error.message);
}