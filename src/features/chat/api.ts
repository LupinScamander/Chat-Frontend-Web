"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { conversationService } from "@/services/conversation.service";
import { messageService } from "@/services/message.service";
import { queryKeys } from "@/lib/query/keys";
import { getSocket } from "@/lib/socket/client";
import type { CreateConversationRequest } from "@/schemas/conversation";

export const useConversations = () =>
  useQuery({
    queryKey: queryKeys.conversations.list,
    queryFn: () => conversationService.list(),
  });

export const useConversation = (id: string) =>
  useQuery({
    queryKey: queryKeys.conversations.open(id),
    queryFn: () => conversationService.open(id, { limit: 50 }),
    enabled: !!id,
  });

export const useMessages = (conversationId: string, limit = 30) =>
  useInfiniteQuery({
    queryKey: queryKeys.messages.list(conversationId),
    queryFn: ({ pageParam }) =>
      messageService.list({
        conversationId,
        limit,
        cursor: pageParam as number | undefined,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      const last = lastPage[lastPage.length - 1];
      return last?.seq;
    },
    enabled: !!conversationId,
  });

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateConversationRequest) => conversationService.create(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list }),
  });
};

export const useSendMessage = (conversationId: string) => {
  return useMutation({
    mutationFn: async (content: string) => {
      const socket = getSocket();
      if (!socket) throw new Error("Socket not connected");
      const clientMessageId = crypto.randomUUID();
      socket.emit("send_message", {
        conversationId,
        type: "text",
        content,
        clientMessageId,
      });
      return { clientMessageId };
    },
    // TODO: optimistic insert via onMutate + setQueryData; reconcile on `message_queued`
  });
};

export const useMarkRead = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => conversationService.markRead(conversationId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list }),
  });
};
