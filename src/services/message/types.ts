import { Message } from "@/types";

export interface GetMessagesQuery {
  conversationId: string;
  limit?: number;
  cursor?: number;
}

export interface SendMessageSocketPayload {
  conversationId: string;
  type: "text" | "image" | "video" | "file" | "audio" | "call" | "system";
  content?: string;
  mediaId?: string;
  replyToId?: string;
  clientMessageId?: string;
  requestId?: string;
}

export interface MessageAckPayload {
  conversationId: string;
  messageId: string;
  status?: "delivered" | "read";
}

export interface ReadReceiptPayload {
  conversationId: string;
  lastReadSeq?: number;
}

export interface TypingPayload {
  conversationId: string;
  receiverId: string;
  isTyping: boolean;
}

export type MessageListResponse = Message[];
