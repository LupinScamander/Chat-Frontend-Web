import { Notification } from "@/types";

export interface CreateNotificationRequest {
  recipientId: string;
  actorId?: string;
  type: "message" | "mention" | "call" | "friend_req" | "system";
  refId?: string;
  refType?: "conversation" | "call" | "friend_request";
  title?: string;
  body?: string;
}

export interface NotificationUnreadCount {
  count: number;
}

export type NotificationItem = Notification;
