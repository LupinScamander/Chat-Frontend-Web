import { z } from "zod";
import { httpClient } from "@/lib/http/client";
import { unwrap } from "@/lib/http/envelope";
import { endpoints } from "./endpoints";
import { type User, userSchema } from "@/schemas/user";
import {
  type FriendRequest,
  type RespondFriendRequestPayload,
  type SendFriendRequestPayload,
  friendRequestSchema,
} from "@/schemas/friend";

export const friendService = {
  list: async (): Promise<User[]> => {
    const res = await httpClient.get(endpoints.friends.list);
    return z.array(userSchema).parse(unwrap(res));
  },
  listRequests: async (): Promise<FriendRequest[]> => {
    const res = await httpClient.get(endpoints.friends.requests);
    return z.array(friendRequestSchema).parse(unwrap(res));
  },
  sendRequest: async (body: SendFriendRequestPayload): Promise<FriendRequest> => {
    const res = await httpClient.post(endpoints.friends.request, body);
    return friendRequestSchema.parse(unwrap(res));
  },
  respondRequest: async (
    id: string,
    body: RespondFriendRequestPayload,
  ): Promise<FriendRequest> => {
    const res = await httpClient.patch(endpoints.friends.requestById(id), body);
    return friendRequestSchema.parse(unwrap(res));
  },
  block: async (blockedId: string): Promise<void> => {
    await httpClient.post(endpoints.friends.block, { blockedId });
  },
};
