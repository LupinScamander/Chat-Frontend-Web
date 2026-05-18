"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService, type UpdateMeRequest } from "@/services/user.service";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/features/auth/store";

export const useUser = (id: string) =>
  useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });

export const useUserSearch = (q: string) =>
  useQuery({
    queryKey: queryKeys.users.search(q),
    queryFn: () => userService.search(q),
    enabled: q.length >= 2,
  });

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (body: UpdateMeRequest) => userService.updateMe(body),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(user.id) });
    },
  });
};

export const useBlockUser = () => {
  return useMutation({
    mutationFn: (id: string) => userService.block(id),
  });
};
