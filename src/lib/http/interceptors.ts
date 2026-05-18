import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth/store";

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

const performRefresh = async (client: AxiosInstance): Promise<string | null> => {
  const { refreshToken, setTokens, clear } = useAuthStore.getState();
  if (!refreshToken) return null;

  try {
    const { data } = await client.post("/auth/refresh", { refreshToken });
    const payload = (data?.data ?? data) as { accessToken?: string; refreshToken?: string };
    if (!payload?.accessToken) {
      clear();
      return null;
    }
    setTokens(payload.accessToken, payload.refreshToken ?? refreshToken);
    return payload.accessToken;
  } catch {
    clear();
    return null;
  }
};

export const attachInterceptors = (client: AxiosInstance): void => {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as RetryableConfig | undefined;
      const status = error.response?.status;

      if (status === 401 && original && !original._retry && !original.url?.includes("/auth/")) {
        original._retry = true;
        refreshPromise = refreshPromise ?? performRefresh(client);
        const newToken = await refreshPromise;
        refreshPromise = null;

        if (newToken) {
          original.headers = original.headers ?? {};
          (original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
          return client.request(original);
        }
      }

      return Promise.reject(error);
    },
  );
};
