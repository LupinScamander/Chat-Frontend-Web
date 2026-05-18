"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { friendService } from "@/services/friend.service";
import { queryKeys } from "@/lib/query/keys";
import type {
  RespondFriendRequestPayload,
  SendFriendRequestPayload,
} from "@/schemas/friend";

export const useFriends = () =>
  useQuery({ queryKey: queryKeys.friends.list, queryFn: () => friendService.list() });

export const useFriendRequests = () =>
  useQuery({
    queryKey: queryKeys.friends.requests,
    queryFn: () => friendService.listRequests(),
  });

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SendFriendRequestPayload) => friendService.sendRequest(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests }),
  });
};

export const useRespondFriendRequest = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: RespondFriendRequestPayload) =>
      friendService.respondRequest(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests });
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.list });
    },
  });
};
