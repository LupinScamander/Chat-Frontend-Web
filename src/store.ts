import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "@/features/chat/chatSlice";
import userReducer from "@/features/user/userSlice";
import friendReducer from "@/features/friend/friendSlice";
import notificationReducer from "@/features/notification/notificationSlice";
import presenceReducer from "@/features/presence/presenceSlice";

// auth slice migrated to Zustand — see features/auth/store.ts
export const store = configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer,
    friend: friendReducer,
    notification: notificationReducer,
    presence: presenceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
