import { httpClient } from "@/lib/http/client";
import { unwrap } from "@/lib/http/envelope";
import { endpoints } from "./endpoints";
import {
  type AuthResponse,
  type AuthTokens,
  type LoginRequest,
  type RegisterRequest,
  type VerifyResponse,
  authResponseSchema,
  authTokensSchema,
  verifyResponseSchema,
} from "@/schemas/auth";

export const authService = {
  login: async (body: LoginRequest): Promise<AuthResponse> => {
    const res = await httpClient.post(endpoints.auth.login, body);
    return authResponseSchema.parse(unwrap(res));
  },
  register: async (body: RegisterRequest): Promise<AuthResponse> => {
    const res = await httpClient.post(endpoints.auth.register, body);
    return authResponseSchema.parse(unwrap(res));
  },
  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const res = await httpClient.post(endpoints.auth.refresh, { refreshToken });
    return authTokensSchema.parse(unwrap(res));
  },
  logout: async (refreshToken: string): Promise<void> => {
    await httpClient.post(endpoints.auth.logout, { refreshToken });
  },
  verify: async (): Promise<VerifyResponse> => {
    const res = await httpClient.post(endpoints.auth.verify);
    return verifyResponseSchema.parse(unwrap(res));
  },
};
