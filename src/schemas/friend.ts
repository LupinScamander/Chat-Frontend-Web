import { z } from "zod";
import { userSchema } from "./user";

export const friendRequestStatusSchema = z.enum([
  "pending",
  "accepted",
  "declined",
  "cancelled",
]);
export type FriendRequestStatus = z.infer<typeof friendRequestStatusSchema>;

export const friendRequestSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  status: friendRequestStatusSchema,
  message: z.string().optional(),
  sender: userSchema.optional(),
  receiver: userSchema.optional(),
  createdAt: z.string().optional(),
});
export type FriendRequest = z.infer<typeof friendRequestSchema>;

export const sendFriendRequestSchema = z.object({
  receiverId: z.string(),
  message: z.string().optional(),
});
export type SendFriendRequestPayload = z.infer<typeof sendFriendRequestSchema>;

export const respondFriendRequestSchema = z.object({
  status: z.enum(["accepted", "declined", "cancelled"]),
});
export type RespondFriendRequestPayload = z.infer<typeof respondFriendRequestSchema>;
