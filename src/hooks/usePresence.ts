import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  clearPresenceError,
  fetchPresenceByUserIdThunk,
} from "@/features/presence/presenceSlice";

export const usePresence = () => {
  const dispatch = useDispatch<AppDispatch>();
  const presenceState = useSelector((state: RootState) => state.presence);

  const getStatus = useCallback((userId: string) => {
    return dispatch(fetchPresenceByUserIdThunk(userId)).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearPresenceError());
  }, [dispatch]);

  return {
    ...presenceState,
    getStatus,
    clearError,
  };
};
