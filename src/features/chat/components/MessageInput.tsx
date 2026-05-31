"use client";

import { type FormEvent, type KeyboardEvent, useRef } from "react";
import { useSendMessage } from "../api";
import { useChatStore } from "../store";
import { getSocket } from "@/lib/socket/client";
import { useAuthStore } from "@/features/auth/store";

interface Props {
  conversationId: string;
}

export function MessageInput({ conversationId }: Props) {
  const draft = useChatStore((s) => s.drafts[conversationId] ?? "");
  const setDraft = useChatStore((s) => s.setDraft);
  const me = useAuthStore((s) => s.user);
  const send = useSendMessage(conversationId);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitTyping = (isTyping: boolean) => {
    const socket = getSocket();
    if (!socket || !me) return;
    socket.emit("typing", { conversationId, receiverId: "", isTyping });
  };

  const handleChange = (value: string) => {
    setDraft(conversationId, value);
    emitTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => emitTyping(false), 1500);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    send.mutate({ content, clientMessageId: crypto.randomUUID() });
    setDraft(conversationId, "");
    emitTyping(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(e);
    }
  };

  return (
    <form onSubmit={submit} className="border-t border-gray-200 p-3 flex gap-2">
      <textarea
        rows={1}
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a message..."
        className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={!draft.trim() || send.isPending}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
