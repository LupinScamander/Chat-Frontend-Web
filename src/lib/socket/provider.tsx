"use client";

import { type ReactNode, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { initSocket, disconnectSocket } from "./client";
import { bindChatSocket } from "@/features/chat/socket";
import { bindCallSocket } from "@/features/call/socket";
import { bindPresenceSocket } from "@/features/presence/socket";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!accessToken) return;
    const socket = initSocket(accessToken);
    const unbinds = [
      bindChatSocket(socket, queryClient),
      bindCallSocket(socket, queryClient),
      bindPresenceSocket(socket, queryClient),
    ];
    return () => {
      unbinds.forEach((fn) => fn());
      disconnectSocket();
    };
  }, [accessToken, queryClient]);

  return <>{children}</>;
};
