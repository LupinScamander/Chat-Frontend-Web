import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState, Conversation, Message, ApiError } from "@/types";

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Load conversations
    loadConversationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loadConversationsSuccess: (state, action: PayloadAction<Conversation[]>) => {
      state.isLoading = false;
      state.conversations = action.payload;
    },
    loadConversationsFailure: (state, action: PayloadAction<ApiError>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Select conversation
    setActiveConversation: (state, action: PayloadAction<Conversation>) => {
      state.activeConversation = action.payload;
      state.messages = action.payload.messages || [];
    },

    // Add message
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      if (state.activeConversation) {
        state.activeConversation.lastMessage = action.payload;
      }
    },

    // Load messages
    loadMessagesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loadMessagesSuccess: (state, action: PayloadAction<Message[]>) => {
      state.isLoading = false;
      state.messages = action.payload;
    },
    loadMessagesFailure: (state, action: PayloadAction<ApiError>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Send message
    sendMessageStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    sendMessageSuccess: (state, action: PayloadAction<Message>) => {
      state.isLoading = false;
      state.messages.push(action.payload);
    },
    sendMessageFailure: (state, action: PayloadAction<ApiError>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loadConversationsStart,
  loadConversationsSuccess,
  loadConversationsFailure,
  setActiveConversation,
  addMessage,
  loadMessagesStart,
  loadMessagesSuccess,
  loadMessagesFailure,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
