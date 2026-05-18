import { io, type Socket } from "socket.io-client";
import { getSocketUrl } from "@/lib/env";
import type { ClientToServerEvents, ServerToClientEvents } from "./events";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

export const initSocket = (token: string): AppSocket => {
  if (socket?.connected) return socket;
  if (socket) {
    socket.auth = { token };
    socket.connect();
    return socket;
  }
  socket = io(getSocketUrl(), {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    transports: ["websocket"],
  });
  return socket;
};

export const getSocket = (): AppSocket | null => socket;

export const disconnectSocket = (): void => {
  socket?.disconnect();
  socket = null;
};
