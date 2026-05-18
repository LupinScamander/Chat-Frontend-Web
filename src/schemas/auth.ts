import { z } from "zod";
import { userSchema } from "./user";

export const registerRequestSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});
export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const loginRequestSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;

export const authResponseSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export const verifyResponseSchema = z.object({
  valid: z.boolean(),
  user: userSchema.optional(),
});
export type VerifyResponse = z.infer<typeof verifyResponseSchema>;
