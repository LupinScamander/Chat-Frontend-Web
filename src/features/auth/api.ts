"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "./store";
import type { LoginRequest, RegisterRequest } from "@/schemas/auth";

export const useLogin = () => {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (body: LoginRequest) => authService.login(body),
    onSuccess: (data) => setSession(data.user, data.accessToken, data.refreshToken),
  });
};

export const useRegister = () => {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (body: RegisterRequest) => authService.register(body),
    onSuccess: (data) => setSession(data.user, data.accessToken, data.refreshToken),
  });
};

export const useLogout = () => {
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        try {
          await authService.logout(refreshToken);
        } catch {
          // ignore — clear local state regardless
        }
      }
    },
    onSettled: () => {
      clear();
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authService.verify(),
    enabled: !!accessToken,
    staleTime: 5 * 60_000,
  });
};
