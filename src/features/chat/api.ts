"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { conversationService } from "@/services/conversation.service";
import { messageService } from "@/services/message.service";
import { queryKeys } from "@/lib/query/keys";
import { getSocket } from "@/lib/socket/client";
import { useAuthStore } from "@/features/auth/store";
import type { CreateConversationRequest } from "@/schemas/conversation";
import type { Message } from "@/schemas/message";
import { trackPending, dropPending } from "./sendQueue";

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
      const oldest = lastPage[lastPage.length - 1];
      return oldest?.seq;
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

interface SendVariables {
  content: string;
  /** Stamped in onMutate so onError can find/remove the temp message. */
  clientMessageId: string;
}

/**
 * Optimistic send. We emit over socket (server processes async); the temp
 * message lives in the messages.list cache until `message_queued` arrives
 * (handled in features/chat/socket.ts) and replaces it with the canonical row.
 */
export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  const me = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async ({ content, clientMessageId }: SendVariables) => {
      const socket = getSocket();
      if (!socket) throw new Error("Socket not connected");
      socket.emit("send_message", {
        conversationId,
        type: "text",
        content,
        clientMessageId,
      });
    },
    onMutate: async (vars) => {
      trackPending(vars.clientMessageId, conversationId);

      const tempMessage: Message = {
        id: vars.clientMessageId,
        clientMessageId: vars.clientMessageId,
        conversationId,
        senderId: me?.id ?? "me",
        type: "text",
        content: vars.content,
        status: "queued",
        createdAt: new Date().toISOString(),
      };

      const key = queryKeys.messages.list(conversationId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<InfiniteData<Message[]>>(key);

      queryClient.setQueryData<InfiniteData<Message[]> | undefined>(key, (old) => {
        if (!old) {
          return { pages: [[tempMessage]], pageParams: [undefined] };
        }
        const pages = [...old.pages];
        pages[0] = [tempMessage, ...(pages[0] ?? [])];
        return { ...old, pages };
      });

      return { previous };
    },
    onError: (_err, vars, ctx) => {
      dropPending(vars.clientMessageId);
      if (ctx?.previous) {
        queryClient.setQueryData(queryKeys.messages.list(conversationId), ctx.previous);
      }
    },
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
