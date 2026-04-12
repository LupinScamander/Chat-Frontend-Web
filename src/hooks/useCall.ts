import { useCallback, useState } from "react";
import { callService } from "@/services/call";
import { CallStatus, CallType } from "@/services/call/types";

export const useCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T,>(fn: () => Promise<T>) => {
    try {
      setIsLoading(true);
      setError(null);
      return await fn();
    } catch (err: any) {
      setError(err?.message || "Call request failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createCall = useCallback((conversationId: string, type: CallType) => {
    return execute(() => callService.create({ conversationId, type }));
  }, []);

  const updateCallStatus = useCallback((callId: string, status: CallStatus) => {
    return execute(() => callService.updateStatus({ callId, status }));
  }, []);

  return {
    isLoading,
    error,
    createCall,
    updateCallStatus,
  };
};
