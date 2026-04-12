import { api } from "@/lib/axios";
import { assertObject, safeString, unwrapData } from "@/middleware/http";
import { User } from "@/types";
import {
  POST_AUTH_LOGIN,
  POST_AUTH_LOGOUT,
  POST_AUTH_REFRESH,
  POST_AUTH_REGISTER,
  POST_AUTH_VERIFY,
} from "@/services/auth/endpoints";
import {
  AuthSuccessResponse,
  AuthTokens,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  VerifyTokenResponse,
} from "@/services/auth/types";

const normalizeUser = (value: unknown): User => {
  const raw = assertObject<Record<string, unknown>>(value, "Invalid user payload");
  return {
    id: safeString(raw.id),
    name: safeString(raw.name || raw.username, "Unknown"),
    email: safeString(raw.email),
    avatar: safeString(raw.avatar) || undefined,
    status: (safeString(raw.status, "offline") as User["status"]) || "offline",
    createdAt: safeString(raw.createdAt, new Date().toISOString()),
  };
};

const normalizeAuthResponse = (value: unknown): AuthSuccessResponse => {
  const raw = assertObject<Record<string, unknown>>(value, "Invalid auth response");
  return {
    user: normalizeUser(raw.user),
    accessToken: safeString(raw.accessToken),
    refreshToken: safeString(raw.refreshToken),
  };
};

export const authService = {
  register: async (payload: RegisterRequest): Promise<AuthSuccessResponse> => {
    const response = await api.post(POST_AUTH_REGISTER, payload);
    return normalizeAuthResponse(unwrapData<unknown>(response));
  },

  login: async (payload: LoginRequest): Promise<AuthSuccessResponse> => {
    const response = await api.post(POST_AUTH_LOGIN, payload);
    return normalizeAuthResponse(unwrapData<unknown>(response));
  },

  refreshToken: async (payload: RefreshTokenRequest): Promise<AuthTokens> => {
    const response = await api.post(POST_AUTH_REFRESH, payload);
    const data = assertObject<Record<string, unknown>>(unwrapData<unknown>(response), "Invalid refresh payload");
    return {
      accessToken: safeString(data.accessToken),
      refreshToken: safeString(data.refreshToken),
    };
  },

  logout: async (payload: LogoutRequest): Promise<void> => {
    await api.post(POST_AUTH_LOGOUT, payload);
  },

  verifyToken: async (): Promise<VerifyTokenResponse> => {
    const response = await api.post(POST_AUTH_VERIFY);
    const data = assertObject<Record<string, unknown>>(unwrapData<unknown>(response), "Invalid verify payload");
    return {
      valid: Boolean(data.valid ?? true),
      user: data.user ? normalizeUser(data.user) : undefined,
    };
  },
};

export type { AuthSuccessResponse, LoginRequest, RegisterRequest };
