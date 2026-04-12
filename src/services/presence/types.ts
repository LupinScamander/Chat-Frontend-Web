export interface PresenceStatus {
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

export interface PresenceSocketEvent {
  userId: string;
  status: "online" | "offline";
  lastSeen?: string;
}
