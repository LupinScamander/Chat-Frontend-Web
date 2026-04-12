import { api } from "@/lib/axios";
import { assertObject, safeString, unwrapData } from "@/middleware/http";
import { GET_USERS_STATUS } from "@/services/presence/endpoints";
import { PresenceStatus } from "@/services/presence/types";

export const presenceService = {
  getStatus: async (userId: string): Promise<PresenceStatus> => {
    const response = await api.get(GET_USERS_STATUS(userId));
    const data = assertObject<Record<string, unknown>>(unwrapData<unknown>(response), "Invalid presence payload");
    return {
      status: (safeString(data.status, "offline") as PresenceStatus["status"]) || "offline",
      lastSeen: safeString(data.lastSeen) || undefined,
    };
  },
};
