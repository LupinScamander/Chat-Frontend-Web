import { create } from "zustand";
import type { CallStatus, CallType } from "@/schemas/call";

interface CallState {
  callId: string | null;
  conversationId: string | null;
  type: CallType | null;
  status: CallStatus | null;
  webrtcRoomId: string | null;
  isIncoming: boolean;
  start: (payload: {
    callId: string;
    conversationId: string;
    type: CallType;
    webrtcRoomId?: string;
    isIncoming?: boolean;
  }) => void;
  setStatus: (status: CallStatus) => void;
  end: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  callId: null,
  conversationId: null,
  type: null,
  status: null,
  webrtcRoomId: null,
  isIncoming: false,
  start: ({ callId, conversationId, type, webrtcRoomId, isIncoming }) =>
    set({
      callId,
      conversationId,
      type,
      status: "ringing",
      webrtcRoomId: webrtcRoomId ?? null,
      isIncoming: !!isIncoming,
    }),
  setStatus: (status) => set({ status }),
  end: () =>
    set({
      callId: null,
      conversationId: null,
      type: null,
      status: null,
      webrtcRoomId: null,
      isIncoming: false,
    }),
}));
