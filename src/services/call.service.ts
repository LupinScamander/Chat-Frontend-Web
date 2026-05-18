import { httpClient } from "@/lib/http/client";
import { unwrap } from "@/lib/http/envelope";
import { endpoints } from "./endpoints";
import {
  type CallSession,
  type CreateCallRequest,
  type UpdateCallStatusRequest,
  callSessionSchema,
} from "@/schemas/call";

export const callService = {
  create: async (body: CreateCallRequest): Promise<CallSession> => {
    const res = await httpClient.post(endpoints.calls.root, body);
    return callSessionSchema.parse(unwrap(res));
  },
  updateStatus: async (body: UpdateCallStatusRequest): Promise<CallSession> => {
    const res = await httpClient.post(endpoints.calls.status, body);
    return callSessionSchema.parse(unwrap(res));
  },
};
