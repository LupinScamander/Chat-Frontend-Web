export const endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    verify: "/auth/verify",
  },
  users: {
    detail: (id: string) => `/users/${id}`,
    me: "/users/me",
    search: "/users/search",
    status: (id: string) => `/users/${id}/status`,
    block: (id: string) => `/users/block/${id}`,
  },
  friends: {
    request: "/friends/request",
    respond: "/friends/respond",
    requestById: (id: string) => `/friends/request/${id}`,
    list: "/friends",
    requests: "/friends/requests",
    block: "/friends/block",
  },
  conversations: {
    root: "/conversations",
    open: (id: string) => `/conversations/${id}/open`,
    read: (id: string) => `/conversations/${id}/read`,
    members: (id: string) => `/conversations/${id}/members`,
    member: (id: string, userId: string) => `/conversations/${id}/members/${userId}`,
  },
  messages: {
    list: "/messages",
  },
  media: {
    presign: "/media/presign",
    confirm: "/media/confirm",
    detail: (id: string) => `/media/${id}`,
    root: "/media",
    status: "/media/status",
  },
  calls: {
    root: "/calls",
    status: "/calls/status",
  },
  notifications: {
    root: "/notifications",
    readOne: (id: string) => `/notifications/${id}/read`,
    readAll: "/notifications/read-all",
    unread: "/notifications/unread",
    unreadCount: "/notifications/unread-count",
  },
} as const;
