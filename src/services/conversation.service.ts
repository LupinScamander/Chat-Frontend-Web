import { z } from "zod";
import { httpClient } from "@/lib/http/client";
import { unwrap } from "@/lib/http/envelope";
import { endpoints } from "./endpoints";
import {
  type AddMembersRequest,
  type Conversation,
  type CreateConversationRequest,
  conversationSchema,
} from "@/schemas/conversation";
import { type Message, messageSchema } from "@/schemas/message";

const openResponseSchema = z.object({
  conversation: conversationSchema,
  messages: z.array(messageSchema).optional().default([]),
  lastReadSeq: z.number().optional(),
});
export type OpenConversationResponse = z.infer<typeof openResponseSchema>;

export const conversationService = {
  list: async (): Promise<Conversation[]> => {
    const res = await httpClient.get(endpoints.conversations.root);
    return z.array(conversationSchema).parse(unwrap(res));
  },
  create: async (body: CreateConversationRequest): Promise<Conversation> => {
    const res = await httpClient.post(endpoints.conversations.root, body);
    return conversationSchema.parse(unwrap(res));
  },
  open: async (
    id: string,
    query?: { limit?: number; cursor?: number },
  ): Promise<OpenConversationResponse> => {
    const res = await httpClient.get(endpoints.conversations.open(id), { params: query });
    return openResponseSchema.parse(unwrap(res));
  },
  markRead: async (id: string): Promise<void> => {
    await httpClient.post(endpoints.conversations.read(id));
  },
  addMembers: async (id: string, body: AddMembersRequest): Promise<void> => {
    await httpClient.post(endpoints.conversations.members(id), body);
  },
  removeMember: async (id: string, userId: string): Promise<void> => {
    await httpClient.delete(endpoints.conversations.member(id, userId));
  },
};
