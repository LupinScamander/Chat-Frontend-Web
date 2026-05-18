import { create } from "zustand";

interface ChatState {
  activeConversationId: string | null;
  drafts: Record<string, string>;
  typingUsers: Record<string, string[]>;
  setActive: (id: string | null) => void;
  setDraft: (conversationId: string, text: string) => void;
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  drafts: {},
  typingUsers: {},
  setActive: (id) => set({ activeConversationId: id }),
  setDraft: (conversationId, text) =>
    set((s) => ({ drafts: { ...s.drafts, [conversationId]: text } })),
  setTyping: (conversationId, userId, isTyping) =>
    set((s) => {
      const current = new Set(s.typingUsers[conversationId] ?? []);
      if (isTyping) current.add(userId);
      else current.delete(userId);
      return {
        typingUsers: { ...s.typingUsers, [conversationId]: Array.from(current) },
      };
    }),
}));
