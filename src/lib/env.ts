import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_ORIGIN: z.string().optional(),
  NEXT_PUBLIC_API_ORIGIN: z.string().optional(),
  NEXT_PUBLIC_BACKEND_API_PREFIX: z.string().optional(),
  NEXT_PUBLIC_SOCKET_URL: z.string().optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_BACKEND_ORIGIN: process.env.NEXT_PUBLIC_BACKEND_ORIGIN,
  NEXT_PUBLIC_API_ORIGIN: process.env.NEXT_PUBLIC_API_ORIGIN,
  NEXT_PUBLIC_BACKEND_API_PREFIX: process.env.NEXT_PUBLIC_BACKEND_API_PREFIX,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
});

const env = parsed.success ? parsed.data : ({} as z.infer<typeof envSchema>);

const trimEnd = (s: string) => s.replace(/\/+$/, "");
const trimStart = (s: string) => s.replace(/^\/+/, "");

export const getBackendOrigin = (): string =>
  env.NEXT_PUBLIC_BACKEND_ORIGIN ?? env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:3000";

export const getApiPrefix = (): string => env.NEXT_PUBLIC_BACKEND_API_PREFIX ?? "/api";

export const getApiBaseUrl = (): string =>
  `${trimEnd(getBackendOrigin())}/${trimStart(getApiPrefix())}`;

export const getSocketUrl = (): string =>
  env.NEXT_PUBLIC_SOCKET_URL ?? getBackendOrigin();
