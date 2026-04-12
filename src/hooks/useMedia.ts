import { useCallback, useState } from "react";
import { mediaService } from "@/services/media";
import { MediaConfirmRequest, MediaPresignQuery } from "@/services/media/types";

export const useMedia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T,>(fn: () => Promise<T>) => {
    try {
      setIsLoading(true);
      setError(null);
      return await fn();
    } catch (err: any) {
      setError(err?.message || "Media request failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getPresign = useCallback((query: MediaPresignQuery) => execute(() => mediaService.getPresign(query)), []);
  const confirmUpload = useCallback((payload: MediaConfirmRequest) => execute(() => mediaService.confirmUpload(payload)), []);
  const getMediaById = useCallback((id: string) => execute(() => mediaService.getById(id)), []);

  return {
    isLoading,
    error,
    getPresign,
    confirmUpload,
    getMediaById,
  };
};
