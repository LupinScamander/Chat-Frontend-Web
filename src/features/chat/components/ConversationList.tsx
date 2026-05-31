"use client";

import { useAuthStore } from "@/features/auth/store";
import { useConversations } from "../api";
import { useChatStore } from "../store";
import { getConversationTitle } from "../helpers";

export function ConversationList() {
  const me = useAuthStore((s) => s.user);
  const activeId = useChatStore((s) => s.activeConversationId);
  const setActive = useChatStore((s) => s.setActive);
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }
  if (!conversations || conversations.length === 0) {
    return <div className="p-4 text-center text-gray-500">No conversations</div>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {conversations.map((c) => {
        const isActive = activeId === c.id;
        return (
          <li
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              isActive ? "bg-blue-50" : ""
            }`}
          >
            <p className="font-medium text-gray-900 truncate">
              {getConversationTitle(c, me?.id)}
            </p>
            {c.lastMessage?.content && (
              <p className="text-sm text-gray-500 truncate">{c.lastMessage.content}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
