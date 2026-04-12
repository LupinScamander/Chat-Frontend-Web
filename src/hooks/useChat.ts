import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
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
} from "@/features/chat/chatSlice";
import { conversationService } from "@/services/conversation";
import { messageService } from "@/services/message";
import { getSocket } from "@/lib/socket";

export const useChat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chatState = useSelector((state: RootState) => state.chat);

  const loadConversations = async () => {
    try {
      dispatch(loadConversationsStart());
      const conversations = await conversationService.list();
      dispatch(loadConversationsSuccess(conversations));
    } catch (error: any) {
      dispatch(
        loadConversationsFailure({
          message: error.response?.data?.message || "Failed to load conversations",
          status: error.response?.status || 500,
          data: error.response?.data,
        })
      );
    }
  };

  const selectConversation = async (conversationId: string) => {
    try {
      const opened = await conversationService.open(conversationId, { limit: 50 });
      const current = chatState.conversations.find((c) => c.id === conversationId);
      if (current) {
        dispatch(
          setActiveConversation({
            ...current,
            messages: opened.messages,
          })
        );
      }
    } catch (error: any) {
      console.error("Failed to load conversation:", error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      dispatch(loadMessagesStart());
      const messages = await messageService.listByConversation({
        conversationId,
        limit: 50,
      });
      dispatch(loadMessagesSuccess(messages));
    } catch (error: any) {
      dispatch(
        loadMessagesFailure({
          message: error.response?.data?.message || "Failed to load messages",
          status: error.response?.status || 500,
          data: error.response?.data,
        })
      );
    }
  };

  const sendMessage = async (conversationId: string, content: string, attachment?: any) => {
    try {
      dispatch(sendMessageStart());
      const socket = getSocket();
      if (!socket) {
        throw new Error("Socket is not connected");
      }

      socket.emit("send_message", {
        conversationId,
        type: attachment ? "file" : "text",
        content,
        clientMessageId: crypto.randomUUID(),
      });

      const message = {
        id: crypto.randomUUID(),
        conversationId,
        senderId: "me",
        senderName: "You",
        content,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      dispatch(sendMessageSuccess(message));
      return message;
    } catch (error: any) {
      dispatch(
        sendMessageFailure({
          message: error.response?.data?.message || "Failed to send message",
          status: error.response?.status || 500,
          data: error.response?.data,
        })
      );
      throw error;
    }
  };

  const handleAddMessage = (message: any) => {
    dispatch(addMessage(message));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    ...chatState,
    loadConversations,
    selectConversation,
    loadMessages,
    sendMessage,
    addMessage: handleAddMessage,
    clearError: handleClearError,
  };
};
