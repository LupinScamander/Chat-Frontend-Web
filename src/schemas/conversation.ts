import { z } from "zod";
import { userSchema } from "./user";
import { messageSchema } from "./message";

export const conversationTypeSchema = z.enum(["direct", "group", "channel"]);
export type ConversationType = z.infer<typeof conversationTypeSchema>;

export const memberRoleSchema = z.enum(["admin", "member"]);
export type MemberRole = z.infer<typeof memberRoleSchema>;

export const conversationMemberSchema = z.object({
  userId: z.string(),
  role: memberRoleSchema.optional().default("member"),
  user: userSchema.optional(),
});
export type ConversationMember = z.infer<typeof conversationMemberSchema>;

export const conversationSchema = z.object({
  id: z.string(),
  type: conversationTypeSchema,
  name: z.string().optional(),
  description: z.string().optional(),
  avatar: z.string().optional(),
  members: z.array(conversationMemberSchema).optional().default([]),
  lastMessage: messageSchema.optional(),
  lastReadSeq: z.number().optional(),
  updatedAt: z.string().optional(),
});
export type Conversation = z.infer<typeof conversationSchema>;

export const createConversationSchema = z.object({
  type: conversationTypeSchema,
  memberIds: z.array(z.string()).min(1, "At least 1 member required"),
  name: z.string().optional(),
  description: z.string().optional(),
  avatar: z.string().optional(),
});
export type CreateConversationRequest = z.infer<typeof createConversationSchema>;

export const addMembersSchema = z.object({
  userIds: z.array(z.string()).min(1),
  role: memberRoleSchema.optional(),
});
export type AddMembersRequest = z.infer<typeof addMembersSchema>;
