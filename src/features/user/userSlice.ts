import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState, User, ApiError } from "@/types";

const initialState: UserState = {
  users: [],
  onlineUsers: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Load users
    loadUsersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loadUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.isLoading = false;
      state.users = action.payload;
    },
    loadUsersFailure: (state, action: PayloadAction<ApiError>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update online users
    setOnlineUsers: (state, action: PayloadAction<User[]>) => {
      state.onlineUsers = action.payload;
    },

    // Update user status
    updateUserStatus: (state, action: PayloadAction<{ userId: string; status: "online" | "offline" | "away" }>) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user) {
        user.status = action.payload.status;
      }
      const onlineUser = state.onlineUsers.find((u) => u.id === action.payload.userId);
      if (onlineUser) {
        onlineUser.status = action.payload.status;
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loadUsersStart,
  loadUsersSuccess,
  loadUsersFailure,
  setOnlineUsers,
  updateUserStatus,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
