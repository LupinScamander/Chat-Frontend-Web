import { create } from "zustand";

export interface Toast {
  id: string;
  title?: string;
  body: string;
  variant?: "default" | "success" | "error";
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { id: crypto.randomUUID(), ...toast }],
    })),
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
