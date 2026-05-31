"use client";

import { useEffect, useMemo } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useConversations, useMarkRead } from "@/features/chat/api";
import { useChatStore } from "@/features/chat/store";
import { getConversationTitle } from "@/features/chat/helpers";
import { ConversationList } from "@/features/chat/components/ConversationList";
import { MessageList } from "@/features/chat/components/MessageList";
import { MessageInput } from "@/features/chat/components/MessageInput";
import { TypingIndicator } from "@/features/chat/components/TypingIndicator";
import { CallButton } from "@/features/call/components/CallButton";

export default function ChatPage() {
  const me = useAuthStore((s) => s.user);
  const activeId = useChatStore((s) => s.activeConversationId);
  const { data: conversations } = useConversations();
  const markRead = useMarkRead(activeId ?? "");

  const activeConversation = useMemo(
    () => conversations?.find((c) => c.id === activeId),
    [conversations, activeId],
  );

  // Mark conversation as read when it becomes active.
  useEffect(() => {
    if (activeId) markRead.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  return (
    <div className="flex h-screen bg-white">
      <aside className="w-full sm:w-72 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList />
        </div>
      </aside>

      <section className="hidden sm:flex flex-1 flex-col">
        {activeConversation ? (
          <>
            <header className="border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {getConversationTitle(activeConversation, me?.id)}
              </h2>
              <div className="flex gap-2">
                <CallButton conversationId={activeConversation.id} type="audio" />
                <CallButton conversationId={activeConversation.id} type="video" />
              </div>
            </header>
            <div className="flex-1 overflow-y-auto">
              <MessageList conversationId={activeConversation.id} />
            </div>
            <TypingIndicator conversationId={activeConversation.id} />
            <MessageInput conversationId={activeConversation.id} />
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </section>
    </div>
  );
}
