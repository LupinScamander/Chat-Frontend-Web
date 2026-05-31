"use client";

import { useAuthStore } from "@/features/auth/store";
import { useConversations } from "@/features/chat/api";
import { useInitiateCall } from "../api";
import { useCallStore } from "../store";
import type { CallType } from "@/schemas/call";

interface Props {
  conversationId: string;
  type?: CallType;
}

/**
 * Initiates a 1-on-1 call. For group/channel conversations the picker UX
 * isn't built yet, so the button is hidden in those cases.
 */
export function CallButton({ conversationId, type = "audio" }: Props) {
  const me = useAuthStore((s) => s.user);
  const { data: conversations } = useConversations();
  const initiate = useInitiateCall();
  const inCall = useCallStore((s) => s.callId !== null);

  const conversation = conversations?.find((c) => c.id === conversationId);
  if (!conversation || conversation.type !== "direct") return null;

  const other = conversation.members.find((m) => m.userId !== me?.id);
  if (!other) return null;

  const label = type === "video" ? "Video" : "Call";

  return (
    <button
      onClick={() =>
        initiate.mutate({ conversationId, remoteUserId: other.userId, type })
      }
      disabled={inCall || initiate.isPending}
      className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {initiate.isPending ? "..." : label}
    </button>
  );
}
