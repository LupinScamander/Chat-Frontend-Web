import { create } from "zustand";
import type { CallStatus, CallType } from "@/schemas/call";

interface CallState {
  callId: string | null;
  conversationId: string | null;
  type: CallType | null;
  status: CallStatus | null;
  webrtcRoomId: string | null;
  isIncoming: boolean;
  remoteUserId: string | null;

  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  audioEnabled: boolean;
  videoEnabled: boolean;

  start: (payload: {
    callId: string;
    conversationId: string;
    type: CallType;
    remoteUserId: string;
    webrtcRoomId?: string;
    isIncoming?: boolean;
  }) => void;
  setStatus: (status: CallStatus) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setAudioEnabled: (v: boolean) => void;
  setVideoEnabled: (v: boolean) => void;
  end: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  callId: null,
  conversationId: null,
  type: null,
  status: null,
  webrtcRoomId: null,
  isIncoming: false,
  remoteUserId: null,

  localStream: null,
  remoteStream: null,
  audioEnabled: true,
  videoEnabled: false,

  start: ({ callId, conversationId, type, remoteUserId, webrtcRoomId, isIncoming }) =>
    set({
      callId,
      conversationId,
      type,
      remoteUserId,
      status: "ringing",
      webrtcRoomId: webrtcRoomId ?? null,
      isIncoming: !!isIncoming,
      audioEnabled: true,
      videoEnabled: type === "video",
    }),
  setStatus: (status) => set({ status }),
  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setAudioEnabled: (v) => set({ audioEnabled: v }),
  setVideoEnabled: (v) => set({ videoEnabled: v }),
  end: () =>
    set({
      callId: null,
      conversationId: null,
      type: null,
      status: null,
      webrtcRoomId: null,
      isIncoming: false,
      remoteUserId: null,
      localStream: null,
      remoteStream: null,
    }),
}));
