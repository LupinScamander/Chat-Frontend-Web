import { api } from "@/lib/axios";
import { assertArray, assertObject, safeString, unwrapData } from "@/middleware/http";
import {
  DELETE_CONVERSATIONS_MEMBER,
  GET_CONVERSATIONS,
  GET_CONVERSATIONS_OPEN,
  PATCH_CONVERSATIONS_READ,
  POST_CONVERSATIONS,
  POST_CONVERSATIONS_MEMBERS,
  POST_CONVERSATIONS_READ,
} from "@/services/conversation/endpoints";
import {
  AddConversationMembersRequest,
  ConversationListItem,
  CreateConversationRequest,
  OpenConversationQuery,
  OpenConversationResponse,
} from "@/services/conversation/types";
import { Conversation, Message, User } from "@/types";

const normalizeUser = (value: unknown): User => {
  const raw = assertObject<Record<string, unknown>>(value, "Invalid participant");
  return {
    id: safeString(raw.id),
    name: safeString(raw.name || raw.username, "Unknown"),
    email: safeString(raw.email),
    avatar: safeString(raw.avatar) || undefined,
    status: (safeString(raw.status, "offline") as User["status"]) || "offline",
    createdAt: safeString(raw.createdAt, new Date().toISOString()),
  };
};

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

const normalizeConversation = (value: unknown): Conversation => {
  const raw = assertObject<Record<string, unknown>>(value, "Invalid conversation payload");
  const participantsRaw = Array.isArray(raw.participants) ? raw.participants : [];
  const lastMessage = raw.lastMessage ? normalizeMessage(raw.lastMessage) : undefined;
  return {
    id: safeString(raw.id),
    name: safeString(raw.name) || undefined,
    avatar: safeString(raw.avatar) || undefined,
    participants: participantsRaw.map(normalizeUser),
    messages: [],
    lastMessage,
    updatedAt: safeString(raw.updatedAt, new Date().toISOString()),
    isGroup: safeString(raw.type) === "group" || Boolean(raw.isGroup),
  };
};

export const conversationService = {
  create: async (payload: CreateConversationRequest): Promise<Conversation> => {
    const response = await api.post(POST_CONVERSATIONS, payload);
    return normalizeConversation(unwrapData<unknown>(response));
  },

  list: async (): Promise<ConversationListItem[]> => {
    const response = await api.get(GET_CONVERSATIONS);
    const data = assertArray<unknown>(unwrapData<unknown>(response), "Invalid conversation list");
    return data.map((item) => {
      const base = normalizeConversation(item);
      const raw = item as Record<string, unknown>;
      return {
        ...base,
        unreadCount: typeof raw.unreadCount === "number" ? raw.unreadCount : 0,
      };
    });
  },

  open: async (id: string, query: OpenConversationQuery = {}): Promise<OpenConversationResponse> => {
    const response = await api.get(GET_CONVERSATIONS_OPEN(id), { params: query });
    const data = assertObject<Record<string, unknown>>(unwrapData<unknown>(response), "Invalid open conversation");
    const messagesRaw = Array.isArray(data.messages) ? data.messages : [];
    return {
      messages: messagesRaw.map(normalizeMessage),
      lastReadSeq: typeof data.lastReadSeq === "number" ? data.lastReadSeq : undefined,
      lastSequence: typeof data.lastSequence === "number" ? data.lastSequence : undefined,
    };
  },

  markRead: async (id: string, lastReadSeq?: number): Promise<void> => {
    const payload = typeof lastReadSeq === "number" ? { lastReadSeq } : undefined;
    try {
      await api.patch(PATCH_CONVERSATIONS_READ(id), payload);
    } catch {
      await api.post(POST_CONVERSATIONS_READ(id), payload);
    }
  },

  addMembers: async (id: string, payload: AddConversationMembersRequest): Promise<void> => {
    await api.post(POST_CONVERSATIONS_MEMBERS(id), payload);
  },

  removeMember: async (id: string, userId: string): Promise<void> => {
    await api.delete(DELETE_CONVERSATIONS_MEMBER(id, userId));
  },
};

export type { CreateConversationRequest, OpenConversationResponse };
