// ============= User Types =============
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  createdAt: string;
}

// ============= Message Types =============
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  attachment?: {
    type: "image" | "file" | "video";
    url: string;
    name: string;
  };
  createdAt: string;
  isRead: boolean;
}

// ============= Conversation Types =============
export interface Conversation {
  id: string;
  name?: string;
  avatar?: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  updatedAt: string;
  isGroup: boolean;
}

// ============= Auth Types =============
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============= API Error Types =============
export interface ApiError {
  message: string;
  status: number;
  data?: Record<string, any>;
}

// ============= Friend / Presence / Notification Types =============
export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  message?: string;
  createdAt?: string;
}

export interface NotificationItem {
  id: string;
  type: "message" | "mention" | "call" | "friend_req" | "system";
  title: string;
  body?: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export type Notification = NotificationItem;

export interface PresenceStatus {
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

export interface PresenceRecord {
  userId: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

// ============= Redux State Types =============
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: ApiError | null;
}

export interface UserState {
  users: User[];
  onlineUsers: User[];
  isLoading: boolean;
  error: ApiError | null;
}

export interface FriendState {
  friends: User[];
  requests: FriendRequest[];
  isLoading: boolean;
  error: ApiError | null;
}

export interface NotificationState {
  items: NotificationItem[];
  unreadItems: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: ApiError | null;
}

export interface PresenceState {
  byUserId: Record<string, PresenceRecord>;
  isLoading: boolean;
  error: ApiError | null;
}
