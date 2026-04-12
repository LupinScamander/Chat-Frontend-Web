import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiError, PresenceRecord, PresenceState } from "@/types";
import { presenceService } from "@/services/presence";

const initialState: PresenceState = {
  byUserId: {},
  isLoading: false,
  error: null,
};

const toApiError = (error: any, fallbackMessage: string): ApiError => ({
  message: error?.response?.data?.message || error?.message || fallbackMessage,
  status: error?.response?.status || 500,
  data: error?.response?.data,
});

export const fetchPresenceByUserIdThunk = createAsyncThunk<
  PresenceRecord,
  string,
  { rejectValue: ApiError }
>("presence/fetchByUserId", async (userId, { rejectWithValue }) => {
  try {
    const data = await presenceService.getStatus(userId);
    return {
      userId,
      status: data.status,
      lastSeen: data.lastSeen,
    };
  } catch (error: any) {
    return rejectWithValue(toApiError(error, "Load presence failed"));
  }
});

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    setPresence: (state, action: PayloadAction<PresenceRecord>) => {
      state.isLoading = false;
      state.byUserId[action.payload.userId] = action.payload;
    },
    setPresenceMany: (state, action: PayloadAction<PresenceRecord[]>) => {
      state.isLoading = false;
      action.payload.forEach((item) => {
        state.byUserId[item.userId] = item;
      });
    },
    clearPresenceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresenceByUserIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPresenceByUserIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.byUserId[action.payload.userId] = action.payload;
      })
      .addCase(fetchPresenceByUserIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      });
  },
});

export const {
  setPresence,
  setPresenceMany,
  clearPresenceError,
} = presenceSlice.actions;

export default presenceSlice.reducer;
