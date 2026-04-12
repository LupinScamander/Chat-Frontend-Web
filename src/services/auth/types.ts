import { User } from "@/types";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSuccessResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user?: User;
}
