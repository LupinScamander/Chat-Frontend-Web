"use client";

import { useChatStore } from "../store";
import { useAuthStore } from "@/features/auth/store";

interface Props {
  conversationId: string;
}

export function TypingIndicator({ conversationId }: Props) {
  const me = useAuthStore((s) => s.user);
  const typing = useChatStore((s) => s.typingUsers[conversationId] ?? []);
  const others = typing.filter((id) => id !== me?.id);

  if (others.length === 0) return null;
  const label = others.length === 1 ? "is typing..." : `${others.length} people are typing...`;
  return <p className="px-4 pb-1 text-xs italic text-gray-500">{label}</p>;
}
