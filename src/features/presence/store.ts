import { create } from "zustand";
import type { UserStatus } from "@/schemas/user";

export interface PresenceRecord {
  userId: string;
  status: UserStatus;
  lastSeen?: string;
}

interface PresenceState {
  byUserId: Record<string, PresenceRecord>;
  setOnline: (userId: string) => void;
  setOffline: (userId: string, lastSeen: string) => void;
  hydrate: (records: PresenceRecord[]) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  byUserId: {},
  setOnline: (userId) =>
    set((s) => ({
      byUserId: { ...s.byUserId, [userId]: { userId, status: "online" } },
    })),
  setOffline: (userId, lastSeen) =>
    set((s) => ({
      byUserId: { ...s.byUserId, [userId]: { userId, status: "offline", lastSeen } },
    })),
  hydrate: (records) =>
    set({ byUserId: Object.fromEntries(records.map((r) => [r.userId, r])) }),
}));
