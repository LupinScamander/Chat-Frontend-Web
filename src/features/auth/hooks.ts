"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store";

/**
 * Redirects to `redirectTo` if not authenticated. Waits for Zustand persist
 * rehydration to finish so we don't bounce logged-in users on page reload.
 */
export const useRequireAuth = (redirectTo = "/login"): { ready: boolean; isAuthed: boolean } => {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (hasHydrated && !accessToken) router.replace(redirectTo);
  }, [hasHydrated, accessToken, router, redirectTo]);

  return { ready: hasHydrated, isAuthed: !!accessToken };
};

export const useRedirectIfAuthed = (redirectTo = "/chat"): void => {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (hasHydrated && accessToken) router.replace(redirectTo);
  }, [hasHydrated, accessToken, router, redirectTo]);
};
