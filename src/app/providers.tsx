"use client";

import { type ReactNode } from "react";
import { Provider as ReduxStoreProvider } from "react-redux";
import { store } from "@/store";
import { QueryProvider } from "@/lib/query/provider";
import { SocketProvider } from "@/lib/socket/provider";

/**
 * Provider stack.
 *
 * Redux is kept transitionally — see FE_ARCHITECTURE.md step 7.
 * Order matters: SocketProvider uses useQueryClient(), so it must sit
 * inside QueryProvider.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxStoreProvider store={store}>
      <QueryProvider>
        <SocketProvider>{children}</SocketProvider>
      </QueryProvider>
    </ReduxStoreProvider>
  );
}
