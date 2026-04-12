import { api } from "@/lib/axios";
import { assertObject, safeString, unwrapData } from "@/middleware/http";
import { POST_CALLS, POST_CALLS_STATUS } from "@/services/call/endpoints";
import { CreateCallRequest, CreateCallResponse, UpdateCallStatusRequest } from "@/services/call/types";

const normalizeCall = (value: unknown): CreateCallResponse => {
  const raw = assertObject<Record<string, unknown>>(value, "Invalid call payload");
  return {
    callId: safeString(raw.callId || raw.id),
    conversationId: safeString(raw.conversationId),
    type: safeString(raw.type, "audio") as CreateCallResponse["type"],
    status: safeString(raw.status, "ringing"),
  };
};

export const callService = {
  create: async (payload: CreateCallRequest): Promise<CreateCallResponse> => {
    const response = await api.post(POST_CALLS, payload);
    return normalizeCall(unwrapData<unknown>(response));
  },

  updateStatus: async (payload: UpdateCallStatusRequest): Promise<CreateCallResponse> => {
    const response = await api.post(POST_CALLS_STATUS, payload);
    return normalizeCall(unwrapData<unknown>(response));
  },
};
