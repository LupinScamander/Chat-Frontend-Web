import type { QueryClient, InfiniteData } from "@tanstack/react-query";
import type { AppSocket } from "@/lib/socket/client";
import { queryKeys } from "@/lib/query/keys";
import { useChatStore } from "./store";
import { consumePending } from "./sendQueue";
import type { Message } from "@/schemas/message";

type Unbind = () => void;

const updateMessagesCache = (
  queryClient: QueryClient,
  conversationId: string,
  mutator: (pages: Message[][]) => Message[][],
) => {
  queryClient.setQueryData<InfiniteData<Message[]> | undefined>(
    queryKeys.messages.list(conversationId),
    (old) => {
      if (!old) return old;
      return { ...old, pages: mutator(old.pages) };
    },
  );
};

export const bindChatSocket = (socket: AppSocket, queryClient: QueryClient): Unbind => {
  /** New message from another participant. */
  const onReceive = (msg: Message) => {
    updateMessagesCache(queryClient, msg.conversationId, (pages) => {
      const head = pages[0] ?? [];
      // Dedup if server echoes a message we already optimistically inserted.
      if (msg.clientMessageId && head.some((m) => m.clientMessageId === msg.clientMessageId)) {
        return pages;
      }
      const next = [...pages];
      next[0] = [msg, ...head];
      return next;
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list });
  };

  /** Server ack for our own send: replace temp row (status=queued) with the canonical one. */
  const onQueued = (p: {
    clientMessageId: string;
    messageId: string;
    seq: number;
    conversationId?: string;
  }) => {
    const conversationId = p.conversationId ?? consumePending(p.clientMessageId);
    if (!conversationId) return;
    updateMessagesCache(queryClient, conversationId, (pages) =>
      pages.map((page) =>
        page.map((m) =>
          m.clientMessageId === p.clientMessageId
            ? { ...m, id: p.messageId, seq: p.seq, status: "delivered" }
            : m,
        ),
      ),
    );
    queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list });
  };

  /** Delivery / read receipt updates. */
  const onDelivered = (p: { messageId: string; userId: string }) => {
    // Best-effort: walk every cached messages list and bump the matching id.
    const queries = queryClient.getQueriesData<InfiniteData<Message[]>>({
      queryKey: queryKeys.messages.all,
    });
    for (const [key, data] of queries) {
      if (!data) continue;
      queryClient.setQueryData<InfiniteData<Message[]>>(key, {
        ...data,
        pages: data.pages.map((page) =>
          page.map((m) => (m.id === p.messageId ? { ...m, status: "delivered" } : m)),
        ),
      });
    }
  };

  const onTyping = (p: { conversationId: string; userId: string; isTyping: boolean }) => {
    useChatStore.getState().setTyping(p.conversationId, p.userId, p.isTyping);
  };

  socket.on("receive_message", onReceive);
  socket.on("message_queued", onQueued);
  socket.on("message_delivered", onDelivered);
  socket.on("typing", onTyping);

  return () => {
    socket.off("receive_message", onReceive);
    socket.off("message_queued", onQueued);
    socket.off("message_delivered", onDelivered);
    socket.off("typing", onTyping);
  };
};
