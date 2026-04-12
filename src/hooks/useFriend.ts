import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  clearFriendError,
  fetchFriendRequestsThunk,
  fetchFriendsThunk,
  respondFriendRequestThunk,
  sendFriendRequestThunk,
} from "@/features/friend/friendSlice";
import { FriendRequestStatus } from "@/services/friend/types";

export const useFriend = () => {
  const dispatch = useDispatch<AppDispatch>();
  const friendState = useSelector((state: RootState) => state.friend);

  const sendRequest = useCallback((receiverId: string, message?: string) => {
    return dispatch(sendFriendRequestThunk({ receiverId, message })).unwrap();
  }, [dispatch]);

  const respondRequest = useCallback((id: string, status: FriendRequestStatus) => {
    return dispatch(respondFriendRequestThunk({ id, status })).unwrap();
  }, [dispatch]);

  const listRequests = useCallback(() => {
    return dispatch(fetchFriendRequestsThunk()).unwrap();
  }, [dispatch]);

  const listFriends = useCallback(() => {
    return dispatch(fetchFriendsThunk()).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearFriendError());
  }, [dispatch]);

  return {
    ...friendState,
    sendRequest,
    respondRequest,
    listRequests,
    listFriends,
    clearError,
  };
};
