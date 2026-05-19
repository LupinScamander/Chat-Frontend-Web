"use client";

import { useRequireAuth } from "@/features/auth/hooks";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { ready, isAuthed } = useRequireAuth("/login");

  if (!ready || !isAuthed) return null;
  return <>{children}</>;
}
