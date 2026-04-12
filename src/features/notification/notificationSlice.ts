import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiError, NotificationItem, NotificationState } from "@/types";
import { notificationService } from "@/services/notification";
import { CreateNotificationRequest } from "@/services/notification/types";

const initialState: NotificationState = {
  items: [],
  unreadItems: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const toApiError = (error: any, fallbackMessage: string): ApiError => ({
  message: error?.response?.data?.message || error?.message || fallbackMessage,
  status: error?.response?.status || 500,
  data: error?.response?.data,
});

export const createNotificationThunk = createAsyncThunk<
  NotificationItem,
  CreateNotificationRequest,
  { rejectValue: ApiError }
>("notification/create", async (payload, { rejectWithValue }) => {
  try {
    return await notificationService.create(payload);
  } catch (error: any) {
    return rejectWithValue(toApiError(error, "Create notification failed"));
  }
});

export const fetchNotificationsThunk = createAsyncThunk<
  NotificationItem[],
  void,
  { rejectValue: ApiError }
>("notification/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await notificationService.listAll();
  } catch (error: any) {
    return rejectWithValue(toApiError(error, "Load notifications failed"));
  }
});

export const fetchUnreadNotificationsThunk = createAsyncThunk<
  NotificationItem[],
  void,
  { rejectValue: ApiError }
>("notification/fetchUnread", async (_, { rejectWithValue }) => {
  try {
    return await notificationService.listUnread();
  } catch (error: any) {
    return rejectWithValue(toApiError(error, "Load unread notifications failed"));
  }
});

export const fetchUnreadCountThunk = createAsyncThunk<
  number,
  void,
  { rejectValue: ApiError }
>("notification/fetchUnreadCount", async (_, { rejectWithValue }) => {
  try {
    const data = await notificationService.unreadCount();
    return data.count;
  } catch (error: any) {
    return rejectWithValue(toApiError(error, "Load unread count failed"));
  }
});

export const markNotificationReadThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiError }
>("notification/markRead", async (id, { rejectWithValue }) => {
  try {
    await notificationService.markRead(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(toApiError(error, "Mark notification read failed"));
  }
});

export const markAllNotificationsReadThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: ApiError }
>("notification/markReadAll", async (_, { rejectWithValue }) => {
  try {
    await notificationService.markReadAll();
  } catch (error: any) {
    return rejectWithValue(toApiError(error, "Mark all notifications read failed"));
  }
});

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    upsertNotification: (state, action: PayloadAction<NotificationItem>) => {
      state.isLoading = false;
      const idx = state.items.findIndex((item) => item.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.unshift(action.payload);
      }

      if (!action.payload.isRead) {
        const unreadIdx = state.unreadItems.findIndex((item) => item.id === action.payload.id);
        if (unreadIdx >= 0) {
          state.unreadItems[unreadIdx] = action.payload;
        } else {
          state.unreadItems.unshift(action.payload);
        }
        state.unreadCount = state.unreadItems.length;
      }
    },
    markNotificationReadInState: (state, action: PayloadAction<string>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload ? { ...item, isRead: true } : item
      );
      state.unreadItems = state.unreadItems.filter((item) => item.id !== action.payload);
      state.unreadCount = state.unreadItems.length;
    },
    markAllNotificationsReadInState: (state) => {
      state.items = state.items.map((item) => ({ ...item, isRead: true }));
      state.unreadItems = [];
      state.unreadCount = 0;
    },

    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNotificationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNotificationThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.items.findIndex((item) => item.id === action.payload.id);
        if (idx >= 0) {
          state.items[idx] = action.payload;
        } else {
          state.items.unshift(action.payload);
        }

        if (!action.payload.isRead) {
          const unreadIdx = state.unreadItems.findIndex((item) => item.id === action.payload.id);
          if (unreadIdx >= 0) {
            state.unreadItems[unreadIdx] = action.payload;
          } else {
            state.unreadItems.unshift(action.payload);
          }
          state.unreadCount = state.unreadItems.length;
        }
      })
      .addCase(createNotificationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchUnreadNotificationsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnreadNotificationsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadItems = action.payload;
        state.unreadCount = action.payload.length;
      })
      .addCase(fetchUnreadNotificationsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchUnreadCountThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnreadCountThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCountThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      })
      .addCase(markNotificationReadThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.map((item) =>
          item.id === action.payload ? { ...item, isRead: true } : item
        );
        state.unreadItems = state.unreadItems.filter((item) => item.id !== action.payload);
        state.unreadCount = state.unreadItems.length;
      })
      .addCase(markNotificationReadThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      })
      .addCase(markAllNotificationsReadThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsReadThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.items = state.items.map((item) => ({ ...item, isRead: true }));
        state.unreadItems = [];
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsReadThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      });
  },
});

export const {
  upsertNotification,
  markNotificationReadInState,
  markAllNotificationsReadInState,
  clearNotificationError,
} = notificationSlice.actions;

export default notificationSlice.reducer;
