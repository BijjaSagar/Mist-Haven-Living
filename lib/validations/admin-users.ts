import { z } from "zod";

const roleSchema = z.enum(["admin", "editor"]);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

export const createAdminUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  name: z.string().trim().optional(),
  role: roleSchema.default("editor"),
});

export const updateAdminUserSchema = z.object({
  name: z.string().trim().nullable().optional(),
  role: roleSchema.optional(),
  active: z.boolean().optional(),
  password: passwordSchema.optional(),
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
