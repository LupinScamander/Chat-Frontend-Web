import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiError, FriendRequest, FriendState, User } from "@/types";
import { friendService } from "@/services/friend";
import { FriendRequestStatus } from "@/services/friend/types";

const initialState: FriendState = {
  friends: [],
  requests: [],
  isLoading: false,
  error: null,
};

const toApiError = (error: any, fallbackMessage: string): ApiError => ({
  message: error?.response?.data?.message || error?.message || fallbackMessage,
  status: error?.response?.status || 500,
  data: error?.response?.data,
});

export const fetchFriendsThunk = createAsyncThunk<
  User[],
  void,
  { rejectValue: ApiError }
>("friend/fetchFriends", async (_, { rejectWithValue }) => {
  try {
    return await friendService.listFriends();
  } catch (error: any) {
    return rejectWithValue(toApiError(error, "Load friends failed"));
  }
});

export const fetchFriendRequestsThunk = createAsyncThunk<
  FriendRequest[],
  void,
  { rejectValue: ApiError }
>("friend/fetchRequests", async (_, { rejectWithValue }) => {
  try {
    return await friendService.listRequests();
  } catch (error: any) {
    return rejectWithValue(toApiError(error, "Load friend requests failed"));
  }
});

export const sendFriendRequestThunk = createAsyncThunk<
  FriendRequest,
  { receiverId: string; message?: string },
  { rejectValue: ApiError }
>("friend/sendRequest", async (payload, { rejectWithValue }) => {
  try {
    return await friendService.sendRequest(payload);
  } catch (error: any) {
    return rejectWithValue(toApiError(error, "Send friend request failed"));
  }
});

export const respondFriendRequestThunk = createAsyncThunk<
  FriendRequest,
  { id: string; status: FriendRequestStatus },
  { rejectValue: ApiError }
>("friend/respondRequest", async (payload, { rejectWithValue }) => {
  try {
    return await friendService.respondRequestById(payload.id, payload.status);
  } catch (error: any) {
    return rejectWithValue(toApiError(error, "Respond friend request failed"));
  }
});

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    upsertFriendRequest: (state, action: PayloadAction<FriendRequest>) => {
      state.isLoading = false;
      const idx = state.requests.findIndex((item) => item.id === action.payload.id);
      if (idx >= 0) {
        state.requests[idx] = action.payload;
      } else {
        state.requests.unshift(action.payload);
      }
    },

    clearFriendError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFriendsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriendsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchFriendRequestsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequestsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchFriendRequestsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      })
      .addCase(sendFriendRequestThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendFriendRequestThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.requests.findIndex((item) => item.id === action.payload.id);
        if (idx >= 0) {
          state.requests[idx] = action.payload;
        } else {
          state.requests.unshift(action.payload);
        }
      })
      .addCase(sendFriendRequestThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      })
      .addCase(respondFriendRequestThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(respondFriendRequestThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.requests.findIndex((item) => item.id === action.payload.id);
        if (idx >= 0) {
          state.requests[idx] = action.payload;
        } else {
          state.requests.unshift(action.payload);
        }
      })
      .addCase(respondFriendRequestThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      });
  },
});

export const {
  upsertFriendRequest,
  clearFriendError,
} = friendSlice.actions;

export default friendSlice.reducer;
