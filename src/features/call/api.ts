"use client";

import { useMutation } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket/client";
import { callService } from "@/services/call.service";
import { toApiError } from "@/lib/http/errors";
import type { CallType } from "@/schemas/call";
import { useCallStore } from "./store";
import { startPeer, getPeer, closePeer } from "./webrtc";

interface InitiateVariables {
  conversationId: string;
  remoteUserId: string;
  type: CallType;
}

/**
 * Caller flow: emit `call:initiate`, wait for server ack with {callId,
 * webrtcRoomId}, then sit in "ringing" until the callee emits `call:accept`
 * (handled in socket.ts, which kicks off the WebRTC offer).
 */
export const useInitiateCall = () => {
  return useMutation({
    mutationFn: async ({ conversationId, remoteUserId, type }: InitiateVariables) => {
      const socket = getSocket();
      if (!socket) throw new Error("Socket not connected");

      const ack = await new Promise<{
        accepted: boolean;
        callId: string;
        webrtcRoomId: string;
      }>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Call initiate timeout")), 10_000);
        socket.emit(
          "call:initiate",
          { conversationId, type },
          (response: { accepted: boolean; callId: string; webrtcRoomId: string }) => {
            clearTimeout(timer);
            resolve(response);
          },
        );
      });

      if (!ack.accepted) throw new Error("Call rejected by server");

      useCallStore.getState().start({
        callId: ack.callId,
        conversationId,
        type,
        remoteUserId,
        webrtcRoomId: ack.webrtcRoomId,
        isIncoming: false,
      });

      startPeer({
        callId: ack.callId,
        remoteUserId,
        isCaller: true,
        audio: true,
        video: type === "video",
      });

      return ack;
    },
    onError: (err) => {
      console.error("initiate call failed:", toApiError(err));
      useCallStore.getState().end();
    },
  });
};

/** Callee accepts an incoming call. Acquires media + starts peer; offer comes from caller. */
export const useAcceptCall = () => {
  return useMutation({
    mutationFn: async () => {
      const socket = getSocket();
      const { callId, remoteUserId, type } = useCallStore.getState();
      if (!socket || !callId || !remoteUserId || !type) {
        throw new Error("No active incoming call");
      }

      const peer = startPeer({
        callId,
        remoteUserId,
        isCaller: false,
        audio: true,
        video: type === "video",
      });
      await peer.acquireMedia();
      socket.emit("call:accept", { callId });
      useCallStore.getState().setStatus("ongoing");
    },
    onError: (err) => {
      console.error("accept call failed:", err);
      useCallStore.getState().setStatus("failed");
      closePeer();
      setTimeout(() => useCallStore.getState().end(), 800);
    },
  });
};

export const useRejectCall = () => {
  return useMutation({
    mutationFn: async () => {
      const socket = getSocket();
      const { callId } = useCallStore.getState();
      if (!socket || !callId) return;
      socket.emit("call:reject", { callId });
      closePeer();
      useCallStore.getState().end();
    },
  });
};

export const useEndCall = () => {
  return useMutation({
    mutationFn: async (
      endReason: "normal" | "timeout" | "network_error" | "user_cancel" = "normal",
    ) => {
      const socket = getSocket();
      const { callId } = useCallStore.getState();
      if (socket && callId) {
        socket.emit("call:end", { callId, endReason });
        try {
          await callService.updateStatus({ callId, status: "ended" });
        } catch {
          // best-effort
        }
      }
      closePeer();
      useCallStore.getState().end();
    },
  });
};

/** Toggle local mic/camera on the active peer. */
export const useCallMedia = () => {
  const setAudioEnabled = useCallStore((s) => s.setAudioEnabled);
  const setVideoEnabled = useCallStore((s) => s.setVideoEnabled);
  return {
    toggleAudio: (enabled: boolean) => {
      getPeer()?.setAudioEnabled(enabled);
      setAudioEnabled(enabled);
    },
    toggleVideo: (enabled: boolean) => {
      getPeer()?.setVideoEnabled(enabled);
      setVideoEnabled(enabled);
    },
  };
};
