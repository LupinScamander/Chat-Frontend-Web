import type { Message, MessageType } from "@/schemas/message";
import type { CallType, CallStatus } from "@/schemas/call";

export interface ClientToServerEvents {
  send_message: (payload: {
    conversationId: string;
    type: MessageType;
    content?: string;
    mediaId?: string;
    replyToId?: string;
    clientMessageId?: string;
    requestId?: string;
  }) => void;
  typing: (payload: {
    conversationId: string;
    receiverId: string;
    isTyping: boolean;
  }) => void;
  message_ack: (payload: {
    conversationId: string;
    messageId: string;
    status?: "delivered" | "read";
  }) => void;
  read_receipt: (payload: {
    conversationId: string;
    lastReadSeq?: number;
  }) => void;
  "call:initiate": (
    payload: { conversationId: string; type: CallType },
    ack: (response: { accepted: boolean; callId: string; webrtcRoomId: string }) => void,
  ) => void;
  "call:accept": (payload: { callId: string }) => void;
  "call:reject": (payload: { callId: string }) => void;
  "webrtc:signal": (payload: {
    callId: string;
    toUserId: string;
    signalType: "offer" | "answer" | "candidate";
    payload: object;
    correlationId?: string;
  }) => void;
  "call:end": (payload: {
    callId: string;
    endReason?: "normal" | "timeout" | "network_error" | "user_cancel";
  }) => void;
}

export interface ServerToClientEvents {
  receive_message: (msg: Message) => void;
  message_queued: (payload: {
    clientMessageId: string;
    messageId: string;
    seq: number;
    /** May be omitted by older servers — sender tracks conversationId locally via sendQueue. */
    conversationId?: string;
  }) => void;
  message_delivered: (payload: { messageId: string; userId: string }) => void;
  read_receipt: (payload: { conversationId: string; userId: string; lastReadSeq: number }) => void;
  typing: (payload: { conversationId: string; userId: string; isTyping: boolean }) => void;
  "call:incoming": (payload: {
    callId: string;
    conversationId: string;
    callerId: string;
    type: CallType;
  }) => void;
  "call:accept": (payload: { callId: string }) => void;
  "call:reject": (payload: { callId: string }) => void;
  "webrtc:signal": (payload: {
    callId: string;
    fromUserId: string;
    signalType: "offer" | "answer" | "candidate";
    payload: object;
    correlationId?: string;
  }) => void;
  "call:end": (payload: { callId: string; status: CallStatus }) => void;
  user_online: (payload: { userId: string }) => void;
  user_offline: (payload: { userId: string; lastSeen: string }) => void;
}
