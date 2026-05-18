"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store";

export const useRequireAuth = (redirectTo = "/login"): boolean => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  useEffect(() => {
    if (!accessToken) router.replace(redirectTo);
  }, [accessToken, router, redirectTo]);
  return !!accessToken;
};

export const useRedirectIfAuthed = (redirectTo = "/chat"): void => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  useEffect(() => {
    if (accessToken) router.replace(redirectTo);
  }, [accessToken, router, redirectTo]);
};
