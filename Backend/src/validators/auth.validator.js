import {z} from "zod";

export const registerSchema = z.object({
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
})

export const loginSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});