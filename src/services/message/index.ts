import { api } from "@/lib/axios";
import { assertArray, assertObject, safeString, unwrapData } from "@/middleware/http";
import { GET_MESSAGES } from "@/services/message/endpoints";
import { GetMessagesQuery } from "@/services/message/types";
import { Message } from "@/types";

const normalizeMessage = (value: unknown): Message => {
  const raw = assertObject<Record<string, unknown>>(value, "Invalid message payload");
  return {
    id: safeString(raw.id),
    conversationId: safeString(raw.conversationId),
    senderId: safeString(raw.senderId),
    senderName: safeString(raw.senderName || raw.senderUsername || "Unknown"),
    senderAvatar: safeString(raw.senderAvatar) || undefined,
    content: safeString(raw.content),
    attachment: raw.attachment as Message["attachment"],
    createdAt: safeString(raw.createdAt, new Date().toISOString()),
    isRead: Boolean(raw.isRead),
  };
};

export const messageService = {
  listByConversation: async (query: GetMessagesQuery): Promise<Message[]> => {
    const response = await api.get(GET_MESSAGES, { params: query });
    const data = assertArray<unknown>(unwrapData<unknown>(response), "Invalid messages list");
    return data.map(normalizeMessage);
  },
};
