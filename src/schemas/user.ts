import { z } from "zod";

export const userStatusSchema = z.enum(["online", "offline", "away"]);
export type UserStatus = z.infer<typeof userStatusSchema>;

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  status: userStatusSchema.optional().default("offline"),
  lastSeen: z.string().optional(),
  createdAt: z.string().optional(),
});
export type User = z.infer<typeof userSchema>;

export const userStatusInfoSchema = z.object({
  status: userStatusSchema,
  lastSeen: z.string().optional(),
});
export type UserStatusInfo = z.infer<typeof userStatusInfoSchema>;
