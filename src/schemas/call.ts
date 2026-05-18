import { z } from "zod";

export const callTypeSchema = z.enum(["audio", "video", "screen_share"]);
export type CallType = z.infer<typeof callTypeSchema>;

export const callStatusSchema = z.enum([
  "ringing",
  "ongoing",
  "ended",
  "missed",
  "declined",
  "timeout",
  "failed",
]);
export type CallStatus = z.infer<typeof callStatusSchema>;

export const callSessionSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  type: callTypeSchema,
  status: callStatusSchema,
  initiatorId: z.string().optional(),
  webrtcRoomId: z.string().optional(),
  createdAt: z.string().optional(),
});
export type CallSession = z.infer<typeof callSessionSchema>;

export const createCallSchema = z.object({
  conversationId: z.string(),
  type: callTypeSchema,
});
export type CreateCallRequest = z.infer<typeof createCallSchema>;

export const updateCallStatusSchema = z.object({
  callId: z.string(),
  status: callStatusSchema,
});
export type UpdateCallStatusRequest = z.infer<typeof updateCallStatusSchema>;
