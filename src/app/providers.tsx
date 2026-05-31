"use client";

import { type ReactNode } from "react";
import { QueryProvider } from "@/lib/query/provider";
import { SocketProvider } from "@/lib/socket/provider";

/**
 * Provider stack. Redux has been fully removed — see FE_ARCHITECTURE.md.
 * SocketProvider uses useQueryClient(), so it must sit inside QueryProvider.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <SocketProvider>{children}</SocketProvider>
    </QueryProvider>
  );
}
