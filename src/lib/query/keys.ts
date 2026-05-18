export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", "detail", id] as const,
    status: (id: string) => ["users", "status", id] as const,
    search: (q: string) => ["users", "search", q] as const,
  },
  friends: {
    list: ["friends", "list"] as const,
    requests: ["friends", "requests"] as const,
  },
  conversations: {
    all: ["conversations"] as const,
    list: ["conversations", "list"] as const,
    detail: (id: string) => ["conversations", "detail", id] as const,
    open: (id: string) => ["conversations", "open", id] as const,
  },
  messages: {
    all: ["messages"] as const,
    list: (conversationId: string) => ["messages", "list", conversationId] as const,
  },
  media: {
    detail: (id: string) => ["media", id] as const,
  },
  notifications: {
    all: ["notifications", "all"] as const,
    unread: ["notifications", "unread"] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },
} as const;
