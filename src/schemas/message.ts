import { z } from "zod";

export const messageTypeSchema = z.enum([
  "text",
  "image",
  "video",
  "file",
  "audio",
  "call",
  "system",
]);
export type MessageType = z.infer<typeof messageTypeSchema>;

export const messageStatusSchema = z.enum(["queued", "delivered", "read", "failed"]);
export type MessageStatus = z.infer<typeof messageStatusSchema>;

export const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  type: messageTypeSchema,
  content: z.string().optional(),
  mediaId: z.string().optional(),
  replyToId: z.string().optional(),
  seq: z.number().optional(),
  clientMessageId: z.string().optional(),
  status: messageStatusSchema.optional(),
  createdAt: z.string(),
});
export type Message = z.infer<typeof messageSchema>;

export const sendMessageSchema = z.object({
  conversationId: z.string(),
  type: messageTypeSchema.optional().default("text"),
  content: z.string().optional(),
  mediaId: z.string().optional(),
  replyToId: z.string().optional(),
  clientMessageId: z.string().optional(),
  requestId: z.string().optional(),
});
export type SendMessagePayload = z.infer<typeof sendMessageSchema>;

export const listMessagesQuerySchema = z.object({
  conversationId: z.string(),
  limit: z.number().optional(),
  cursor: z.number().optional(),
});
export type ListMessagesQuery = z.infer<typeof listMessagesQuerySchema>;
