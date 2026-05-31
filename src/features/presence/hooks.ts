"use client";

import { useQuery } from "@tanstack/react-query";
import { presenceService } from "@/services/presence.service";
import { queryKeys } from "@/lib/query/keys";
import { usePresenceStore, type PresenceRecord } from "./store";

/**
 * Read presence for a single user. Prefer the live socket value from the
 * Zustand store; fall back to a one-shot REST fetch if we haven't received
 * any socket event yet for that user.
 */
export const usePresenceFor = (userId: string): PresenceRecord | undefined => {
  const live = usePresenceStore((s) => s.byUserId[userId]);

  const { data: fallback } = useQuery({
    queryKey: queryKeys.users.status(userId),
    queryFn: () => presenceService.getStatus(userId),
    enabled: !!userId && !live,
    staleTime: 30_000,
  });

  if (live) return live;
  if (fallback) return { userId, status: fallback.status, lastSeen: fallback.lastSeen };
  return undefined;
};
