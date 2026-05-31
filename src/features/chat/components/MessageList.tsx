"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useConversations, useMessages } from "../api";
import type { Message } from "@/schemas/message";

interface Props {
  conversationId: string;
}

export function MessageList({ conversationId }: Props) {
  const me = useAuthStore((s) => s.user);
  const { data: conversations } = useConversations();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useMessages(conversationId);

  const memberMap = useMemo(() => {
    const conv = conversations?.find((c) => c.id === conversationId);
    const map = new Map<string, string>();
    conv?.members.forEach((m) => {
      if (m.user?.username) map.set(m.userId, m.user.username);
    });
    return map;
  }, [conversations, conversationId]);

  if (isLoading) {
    return <p className="p-4 text-center text-gray-500">Loading messages...</p>;
  }

  // Pages are returned newest-first per page. Flatten then reverse for visual order.
  const messages: Message[] = (data?.pages ?? []).flat();
  if (messages.length === 0) {
    return <p className="p-4 text-center text-gray-500">No messages yet</p>;
  }

  return (
    <div className="flex flex-col-reverse gap-2 p-4">
      {messages.map((m) => {
        const isMine = m.senderId === me?.id;
        const senderName = isMine ? "You" : memberMap.get(m.senderId) ?? m.senderId;
        return (
          <div
            key={m.id}
            className={`max-w-[75%] rounded-lg px-3 py-2 ${
              isMine ? "self-end bg-blue-600 text-white" : "self-start bg-gray-100 text-gray-900"
            } ${m.status === "queued" ? "opacity-60" : ""} ${
              m.status === "failed" ? "ring-2 ring-red-500" : ""
            }`}
          >
            {!isMine && (
              <p className="text-xs font-medium opacity-75 mb-0.5">{senderName}</p>
            )}
            <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
            {m.status === "failed" && (
              <p className="text-xs mt-1 text-red-200">Failed to send</p>
            )}
          </div>
        );
      })}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="self-center text-xs text-blue-600 hover:underline disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading..." : "Load older messages"}
        </button>
      )}
    </div>
  );
}
