import { api } from "@/lib/axios";
import { assertArray, assertObject, safeString, unwrapData } from "@/middleware/http";
import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_UNREAD,
  GET_NOTIFICATIONS_UNREAD_COUNT,
  PATCH_NOTIFICATIONS_READ,
  PATCH_NOTIFICATIONS_READ_ALL,
  POST_NOTIFICATIONS,
} from "@/services/notification/endpoints";
import { CreateNotificationRequest, NotificationUnreadCount } from "@/services/notification/types";
import { Notification } from "@/types";

const normalizeNotification = (value: unknown): Notification => {
  const raw = assertObject<Record<string, unknown>>(value, "Invalid notification payload");
  return {
    id: safeString(raw.id),
    type: safeString(raw.type, "system") as Notification["type"],
    title: safeString(raw.title, "Notification"),
    body: safeString(raw.body) || undefined,
    data: (raw.data as Record<string, unknown>) || undefined,
    isRead: Boolean(raw.isRead),
    createdAt: safeString(raw.createdAt, new Date().toISOString()),
  };
};

export const notificationService = {
  create: async (payload: CreateNotificationRequest): Promise<Notification> => {
    const response = await api.post(POST_NOTIFICATIONS, payload);
    return normalizeNotification(unwrapData<unknown>(response));
  },

  markRead: async (id: string): Promise<void> => {
    await api.patch(PATCH_NOTIFICATIONS_READ(id));
  },

  markReadAll: async (): Promise<void> => {
    await api.patch(PATCH_NOTIFICATIONS_READ_ALL);
  },

  listAll: async (): Promise<Notification[]> => {
    const response = await api.get(GET_NOTIFICATIONS);
    const data = assertArray<unknown>(unwrapData<unknown>(response), "Invalid notifications list");
    return data.map(normalizeNotification);
  },

  listUnread: async (): Promise<Notification[]> => {
    const response = await api.get(GET_NOTIFICATIONS_UNREAD);
    const data = assertArray<unknown>(unwrapData<unknown>(response), "Invalid unread list");
    return data.map(normalizeNotification);
  },

  unreadCount: async (): Promise<NotificationUnreadCount> => {
    const response = await api.get(GET_NOTIFICATIONS_UNREAD_COUNT);
    const data = assertObject<Record<string, unknown>>(unwrapData<unknown>(response), "Invalid unread count");
    return { count: Number(data.count ?? 0) };
  },
};
