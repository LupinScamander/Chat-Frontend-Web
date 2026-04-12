import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  clearNotificationError,
  createNotificationThunk,
  fetchNotificationsThunk,
  fetchUnreadCountThunk,
  fetchUnreadNotificationsThunk,
  markAllNotificationsReadThunk,
  markNotificationReadThunk,
} from "@/features/notification/notificationSlice";
import { CreateNotificationRequest } from "@/services/notification/types";

export const useNotification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notificationState = useSelector((state: RootState) => state.notification);

  const createNotification = useCallback((payload: CreateNotificationRequest) => {
    return dispatch(createNotificationThunk(payload)).unwrap();
  }, [dispatch]);

  const listNotifications = useCallback(() => {
    return dispatch(fetchNotificationsThunk()).unwrap();
  }, [dispatch]);

  const listUnreadNotifications = useCallback(() => {
    return dispatch(fetchUnreadNotificationsThunk()).unwrap();
  }, [dispatch]);

  const markRead = useCallback((id: string) => {
    return dispatch(markNotificationReadThunk(id)).unwrap();
  }, [dispatch]);

  const markReadAll = useCallback(() => {
    return dispatch(markAllNotificationsReadThunk()).unwrap();
  }, [dispatch]);

  const unreadCount = useCallback(() => {
    return dispatch(fetchUnreadCountThunk()).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearNotificationError());
  }, [dispatch]);

  return {
    ...notificationState,
    createNotification,
    listNotifications,
    listUnreadNotifications,
    markRead,
    markReadAll,
    unreadCount,
    clearError,
  };
};
