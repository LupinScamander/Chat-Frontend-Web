import { api } from "@/lib/axios";
import { assertArray, assertObject, safeString, unwrapData } from "@/middleware/http";
import {
  GET_FRIENDS,
  GET_FRIENDS_REQUESTS,
  PATCH_FRIENDS_REQUEST_BY_ID,
  POST_FRIENDS_BLOCK,
  POST_FRIENDS_REQUEST,
  POST_FRIENDS_RESPOND,
} from "@/services/friend/endpoints";
import {
  FriendRequestItem,
  FriendRequestPayload,
  FriendRespondPayload,
  FriendRequestStatus,
} from "@/services/friend/types";
import { User } from "@/types";

const normalizeFriendRequest = (value: unknown): FriendRequestItem => {
  const raw = assertObject<Record<string, unknown>>(value, "Invalid friend request");
  return {
    id: safeString(raw.id),
    senderId: safeString(raw.senderId),
    receiverId: safeString(raw.receiverId),
    status: safeString(raw.status, "pending"),
    message: safeString(raw.message) || undefined,
    createdAt: safeString(raw.createdAt) || undefined,
  };
};

const normalizeUser = (value: unknown): User => {
  const raw = assertObject<Record<string, unknown>>(value, "Invalid friend user");
  return {
    id: safeString(raw.id),
    name: safeString(raw.name || raw.username, "Unknown"),
    email: safeString(raw.email),
    avatar: safeString(raw.avatar) || undefined,
    status: (safeString(raw.status, "offline") as User["status"]) || "offline",
    createdAt: safeString(raw.createdAt, new Date().toISOString()),
  };
};

export const friendService = {
  sendRequest: async (payload: FriendRequestPayload): Promise<FriendRequestItem> => {
    const response = await api.post(POST_FRIENDS_REQUEST, payload);
    return normalizeFriendRequest(unwrapData<unknown>(response));
  },

  respondRequestById: async (id: string, status: FriendRequestStatus): Promise<FriendRequestItem> => {
    const response = await api.patch(PATCH_FRIENDS_REQUEST_BY_ID(id), { status });
    return normalizeFriendRequest(unwrapData<unknown>(response));
  },

  respondLegacy: async (payload: FriendRespondPayload): Promise<FriendRequestItem> => {
    const response = await api.post(POST_FRIENDS_RESPOND, payload);
    return normalizeFriendRequest(unwrapData<unknown>(response));
  },

  listRequests: async (): Promise<FriendRequestItem[]> => {
    const response = await api.get(GET_FRIENDS_REQUESTS);
    const data = assertArray<unknown>(unwrapData<unknown>(response), "Invalid friend requests");
    return data.map(normalizeFriendRequest);
  },

  listFriends: async (): Promise<User[]> => {
    const response = await api.get(GET_FRIENDS);
    const data = assertArray<unknown>(unwrapData<unknown>(response), "Invalid friends list");
    return data.map(normalizeUser);
  },

  blockLegacy: async (blockedId: string): Promise<void> => {
    await api.post(POST_FRIENDS_BLOCK, { blockedId });
  },
};

export type { FriendRequestItem };
