// ============= API URLs =============
const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://localhost:3000";
const BACKEND_API_PREFIX = process.env.NEXT_PUBLIC_BACKEND_API_PREFIX || "/api";
export const API_BASE_URL = `${BACKEND_ORIGIN.replace(/\/+$/, "")}/${BACKEND_API_PREFIX.replace(/^\/+/, "")}`;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

// ============= Message Types =============
export const MESSAGE_TYPE = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
  VIDEO: "video",
  VOICE: "voice",
} as const;

// ============= User Status =============
export const USER_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  AWAY: "away",
} as const;

// ============= Conversation Types =============
export const CONVERSATION_TYPE = {
  PRIVATE: "private",
  GROUP: "group",
  CHANNEL: "channel",
} as const;

// ============= Local Storage Keys =============
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

// ============= Pagination =============
export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  DEFAULT_OFFSET: 0,
  MAX_LIMIT: 100,
} as const;

// ============= Validation Rules =============
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 32,
  MESSAGE_MAX_LENGTH: 5000,
  FILE_MAX_SIZE: 10 * 1024 * 1024, // 10 MB
} as const;

// ============= Error Messages =============
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error occurred",
  UNAUTHORIZED: "You are not authorized",
  FORBIDDEN: "You do not have permission",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Validation error",
  SERVER_ERROR: "Server error occurred",
} as const;

// ============= Success Messages =============
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "login successful",
  LOGOUT_SUCCESS: "logout successful",
  MESSAGE_SENT: "Message sent successfully",
  PROFILE_UPDATED: "Profile updated successfully",
} as const;
