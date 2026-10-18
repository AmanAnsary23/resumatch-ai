import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email")
      .transform((email) => email.toLowerCase()),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .refine(
        (password) => Buffer.byteLength(password, "utf8") <= 72,
        "Password cannot exceed 72 bytes"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .transform((email) => email.toLowerCase()),

  password: z.string().min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .transform((email) => email.toLowerCase()),

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export const resendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .transform((email) => email.toLowerCase()),
});