import { UserRole } from "@/prisma/generated/prisma/enums";
import * as z from "zod";

export const userNameSchema = z.object({
  name: z.string().min(3).max(32),
});

export const userRoleSchema = z.object({
  role: z.enum(UserRole),
});
