import type { QueryClient, InfiniteData } from "@tanstack/react-query";
import type { AppSocket } from "@/lib/socket/client";
import { queryKeys } from "@/lib/query/keys";
import { useChatStore } from "./store";
import type { Message } from "@/schemas/message";

type Unbind = () => void;

export const bindChatSocket = (socket: AppSocket, queryClient: QueryClient): Unbind => {
  const onReceive = (msg: Message) => {
    queryClient.setQueryData<InfiniteData<Message[]> | undefined>(
      queryKeys.messages.list(msg.conversationId),
      (old) => {
        if (!old) return old;
        const pages = [...old.pages];
        pages[0] = [msg, ...(pages[0] ?? [])];
        return { ...old, pages };
      },
    );
    queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list });
  };

  const onTyping = (p: { conversationId: string; userId: string; isTyping: boolean }) => {
    useChatStore.getState().setTyping(p.conversationId, p.userId, p.isTyping);
  };

  socket.on("receive_message", onReceive);
  socket.on("typing", onTyping);

  return () => {
    socket.off("receive_message", onReceive);
    socket.off("typing", onTyping);
  };
};
