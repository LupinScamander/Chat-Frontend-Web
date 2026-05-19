import type { AppSocket } from "@/lib/socket/client";
import { usePresenceStore } from "./store";

type Unbind = () => void;

export const bindPresenceSocket = (socket: AppSocket): Unbind => {
  const onOnline = (p: { userId: string }) =>
    usePresenceStore.getState().setOnline(p.userId);
  const onOffline = (p: { userId: string; lastSeen: string }) =>
    usePresenceStore.getState().setOffline(p.userId, p.lastSeen);

  socket.on("user_online", onOnline);
  socket.on("user_offline", onOffline);

  return () => {
    socket.off("user_online", onOnline);
    socket.off("user_offline", onOffline);
  };
};
