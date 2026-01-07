import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const createAccountSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .min(1, { message: "Email is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  readTandC: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one capital letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[a-zA-Z0-9]/, "Password must contain alphanumeric characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
