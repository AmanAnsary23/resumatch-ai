import bcrypt from "bcryptjs";
import crypto from "node:crypto";

import {
  findUserByEmail,
  findUserByEmailForLogin,
  createUser,
  markEmailAsVerified,
} from "../repositories/user.repository.js";

import {
  findVerificationByEmail,
  saveVerification,
  deleteVerification,
  incrementVerificationAttempts,
} from "../repositories/email-verification.repository.js";

import { sendOtpEmail } from "./email.service.js";
import { createTokens } from "./token.service.js";

export const registerUser = async ({
  name,
  email,
  password,
  confirmPassword,
}) => {
  if (password !== confirmPassword) {
    const error = new Error("Passwords do not match");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser?.isEmailVerified) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = existingUser ?? await createUser({
    name,
    email,
    passwordHash,
  });

  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  await saveVerification({
    email,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  try {
    await sendOtpEmail(email, otp);
  } catch (error) {
    console.error("OTP email sending failed:", error.message);

    const sendError = new Error(
      "Unable to send verification email. Please try again."
    );
    sendError.statusCode = 502;
    throw sendError;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    message: "Verification OTP sent to your email",
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmailForLogin(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isEmailVerified) {
    const error = new Error("Please verify your email before logging in");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const tokens = await createTokens(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    ...tokens,
  };
};

export const verifyEmailOtp = async ({ email, otp }) => {
  const verification = await findVerificationByEmail(email);

  if (!verification) {
    const error = new Error("OTP not found. Please register again.");
    error.statusCode = 400;
    throw error;
  }

  if (verification.expiresAt <= new Date()) {
    await deleteVerification(email);

    const error = new Error("OTP has expired. Please register again.");
    error.statusCode = 400;
    throw error;
  }

  if (verification.attempts >= 5) {
    await deleteVerification(email);

    const error = new Error("Too many attempts. Please request a new OTP.");
    error.statusCode = 429;
    throw error;
  }

  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  if (otpHash !== verification.otpHash) {
    await incrementVerificationAttempts(email);

    const error = new Error("Invalid OTP");
    error.statusCode = 400;
    throw error;
  }

  await markEmailAsVerified(email);
  await deleteVerification(email);

  return {
    success: true,
    message: "Email verified successfully. You can now log in.",
  };
};

export const resendEmailOtp = async ({ email }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error("Please register before requesting an OTP");
    error.statusCode = 404;
    throw error;
  }

  if (user.isEmailVerified) {
    const error = new Error("Email is already verified. Please log in.");
    error.statusCode = 409;
    throw error;
  }

  const verification = await findVerificationByEmail(email);

  if (
    verification &&
    Date.now() - verification.lastSentAt.getTime() < 60 * 1000
  ) {
    const error = new Error("Please wait before requesting another OTP");
    error.statusCode = 429;
    throw error;
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  await saveVerification({
    email,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  try {
    await sendOtpEmail(email, otp);
  } catch (error) {
    console.error("Resend OTP email failed:", error.message);

    const sendError = new Error("Unable to send OTP. Please try again.");
    sendError.statusCode = 502;
    throw sendError;
  }

  return {
    message: "A new OTP has been sent to your email",
  };
};