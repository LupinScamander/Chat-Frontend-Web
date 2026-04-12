import { api } from "@/lib/axios";
import { assertArray, assertObject, safeString, unwrapData } from "@/middleware/http";
import {
  GET_USERS_BY_ID,
  GET_USERS_SEARCH,
  GET_USERS_STATUS,
  PATCH_USERS_ME,
  POST_USERS_BLOCK,
} from "@/services/user/endpoints";
import { SearchUsersQuery, UpdateProfileRequest, UserProfile, UserStatusResponse } from "@/services/user/types";

const normalizeProfile = (value: unknown): UserProfile => {
  const raw = assertObject<Record<string, unknown>>(value, "Invalid user profile");
  return {
    id: safeString(raw.id),
    name: safeString(raw.name || raw.username, "Unknown"),
    username: safeString(raw.username) || undefined,
    email: safeString(raw.email),
    avatar: safeString(raw.avatar) || undefined,
    bio: safeString(raw.bio) || undefined,
    phoneNumber: safeString(raw.phoneNumber) || undefined,
    status: (safeString(raw.status, "offline") as UserProfile["status"]) || "offline",
    createdAt: safeString(raw.createdAt, new Date().toISOString()),
  };
};

export const userService = {
  getById: async (id: string): Promise<UserProfile> => {
    const response = await api.get(GET_USERS_BY_ID(id));
    return normalizeProfile(unwrapData<unknown>(response));
  },

  updateMe: async (payload: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await api.patch(PATCH_USERS_ME, payload);
    return normalizeProfile(unwrapData<unknown>(response));
  },

  search: async (query: SearchUsersQuery): Promise<UserProfile[]> => {
    const response = await api.get(GET_USERS_SEARCH, { params: query });
    const data = assertArray<unknown>(unwrapData<unknown>(response), "Invalid user search list");
    return data.map(normalizeProfile);
  },

  getStatus: async (id: string): Promise<UserStatusResponse> => {
    const response = await api.get(GET_USERS_STATUS(id));
    const data = assertObject<Record<string, unknown>>(unwrapData<unknown>(response), "Invalid user status");
    return {
      status: (safeString(data.status, "offline") as UserStatusResponse["status"]) || "offline",
      lastSeen: safeString(data.lastSeen) || undefined,
    };
  },

  block: async (id: string): Promise<void> => {
    await api.post(POST_USERS_BLOCK(id));
  },
};

export type { UpdateProfileRequest, UserProfile };
