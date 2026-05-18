import { z } from "zod";

export const notificationTypeSchema = z.enum([
  "message",
  "mention",
  "call",
  "friend_req",
  "system",
]);
export type NotificationType = z.infer<typeof notificationTypeSchema>;

export const notificationRefTypeSchema = z.enum([
  "conversation",
  "call",
  "friend_request",
]);
export type NotificationRefType = z.infer<typeof notificationRefTypeSchema>;

export const notificationSchema = z.object({
  id: z.string(),
  recipientId: z.string(),
  actorId: z.string().optional(),
  type: notificationTypeSchema,
  refId: z.string().optional(),
  refType: notificationRefTypeSchema.optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  isRead: z.boolean().optional().default(false),
  createdAt: z.string(),
});
export type Notification = z.infer<typeof notificationSchema>;

export const createNotificationSchema = z.object({
  recipientId: z.string(),
  actorId: z.string().optional(),
  type: notificationTypeSchema,
  refId: z.string().optional(),
  refType: notificationRefTypeSchema.optional(),
  title: z.string().optional(),
  body: z.string().optional(),
});
export type CreateNotificationRequest = z.infer<typeof createNotificationSchema>;
