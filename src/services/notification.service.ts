import { z } from "zod";
import { httpClient } from "@/lib/http/client";
import { unwrap } from "@/lib/http/envelope";
import { endpoints } from "./endpoints";
import {
  type CreateNotificationRequest,
  type Notification,
  notificationSchema,
} from "@/schemas/notification";

export const notificationService = {
  list: async (): Promise<Notification[]> => {
    const res = await httpClient.get(endpoints.notifications.root);
    return z.array(notificationSchema).parse(unwrap(res));
  },
  listUnread: async (): Promise<Notification[]> => {
    const res = await httpClient.get(endpoints.notifications.unread);
    return z.array(notificationSchema).parse(unwrap(res));
  },
  unreadCount: async (): Promise<number> => {
    const res = await httpClient.get(endpoints.notifications.unreadCount);
    const data = unwrap<{ count?: number } | number>(res);
    return typeof data === "number" ? data : (data?.count ?? 0);
  },
  create: async (body: CreateNotificationRequest): Promise<Notification> => {
    const res = await httpClient.post(endpoints.notifications.root, body);
    return notificationSchema.parse(unwrap(res));
  },
  markRead: async (id: string): Promise<void> => {
    await httpClient.patch(endpoints.notifications.readOne(id));
  },
  markAllRead: async (): Promise<void> => {
    await httpClient.patch(endpoints.notifications.readAll);
  },
};
