import { useCallback, useState } from "react";
import { userService } from "@/services/user";
import { UserProfile } from "@/services/user/types";

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T,>(fn: () => Promise<T>) => {
    try {
      setIsLoading(true);
      setError(null);
      return await fn();
    } catch (err: any) {
      setError(err?.message || "User request failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserById = useCallback((id: string) => execute(() => userService.getById(id)), []);
  const updateProfile = useCallback((payload: Partial<UserProfile>) => execute(() => userService.updateMe(payload)), []);
  const searchUsers = useCallback((q: string) => execute(() => userService.search({ q })), []);
  const getStatus = useCallback((id: string) => execute(() => userService.getStatus(id)), []);
  const blockUser = useCallback((id: string) => execute(() => userService.block(id)), []);

  return {
    isLoading,
    error,
    getUserById,
    updateProfile,
    searchUsers,
    getStatus,
    blockUser,
  };
};
