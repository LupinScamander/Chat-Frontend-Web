import { Conversation, Message } from "@/types";

export type ConversationKind = "direct" | "group" | "channel";

export interface CreateConversationRequest {
  type: ConversationKind;
  memberIds: string[];
  name?: string;
  description?: string;
  avatar?: string;
}

export interface OpenConversationQuery {
  limit?: number;
  cursor?: number;
}

export interface OpenConversationResponse {
  messages: Message[];
  lastReadSeq?: number;
  lastSequence?: number;
}

export interface AddConversationMembersRequest {
  userIds: string[];
  role?: "admin" | "member";
}

export interface ConversationListItem extends Conversation {
  unreadCount?: number;
}
