"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { queryKeys } from "@/lib/query/keys";

const invalidateAll = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
  qc.invalidateQueries({ queryKey: queryKeys.notifications.unread });
  qc.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount });
};

export const useNotifications = () =>
  useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: () => notificationService.list(),
  });

export const useUnreadNotifications = () =>
  useQuery({
    queryKey: queryKeys.notifications.unread,
    queryFn: () => notificationService.listUnread(),
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: () => notificationService.unreadCount(),
    refetchInterval: 60_000,
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => invalidateAll(queryClient),
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => invalidateAll(queryClient),
  });
};
