import {
  signInSchema,
  createAccountSchema,
  passwordChangeSchema,
} from "@/lib/schemas";
import { z } from "zod";

export type signInSchemaType = z.infer<typeof signInSchema>;
export type createAccountSchemaType = z.infer<typeof createAccountSchema>;
export type PasswordChangeSchemaType = z.infer<typeof passwordChangeSchema>;
