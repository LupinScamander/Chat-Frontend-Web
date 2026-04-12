export type CallType = "audio" | "video" | "screen_share";

export interface CreateCallRequest {
  conversationId: string;
  type: CallType;
}

export interface CreateCallResponse {
  callId: string;
  conversationId: string;
  type: CallType;
  status: string;
}

export type CallStatus =
  | "ringing"
  | "ongoing"
  | "ended"
  | "missed"
  | "declined"
  | "timeout"
  | "failed";

export interface UpdateCallStatusRequest {
  callId: string;
  status: CallStatus;
}
