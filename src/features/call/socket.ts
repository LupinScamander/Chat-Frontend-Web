import type { AppSocket } from "@/lib/socket/client";
import type { CallStatus, CallType } from "@/schemas/call";
import { useCallStore } from "./store";
import { getPeer, closePeer } from "./webrtc";

type Unbind = () => void;

export const bindCallSocket = (socket: AppSocket): Unbind => {
  /** Callee gets this when someone calls them. */
  const onIncoming = (p: {
    callId: string;
    conversationId: string;
    callerId: string;
    type: CallType;
  }) => {
    useCallStore.getState().start({
      callId: p.callId,
      conversationId: p.conversationId,
      type: p.type,
      remoteUserId: p.callerId,
      isIncoming: true,
    });
  };

  /**
   * Caller gets this after callee accepts. Caller starts WebRTC handshake by
   * acquiring media + making an offer. The peer was created in useInitiateCall
   * onSuccess; here we just kick off offer.
   */
  const onAccept = async () => {
    useCallStore.getState().setStatus("ongoing");
    const peer = getPeer();
    if (!peer) return;
    try {
      await peer.acquireMedia();
      await peer.makeOffer();
    } catch (err) {
      console.error("call accept (caller side) failed:", err);
      useCallStore.getState().setStatus("failed");
    }
  };

  const onReject = () => {
    useCallStore.getState().setStatus("declined");
    closePeer();
    setTimeout(() => useCallStore.getState().end(), 800);
  };

  const onEnd = (p: { callId: string; status: CallStatus }) => {
    useCallStore.getState().setStatus(p.status);
    closePeer();
    setTimeout(() => useCallStore.getState().end(), 800);
  };

  const onSignal = async (p: {
    callId: string;
    fromUserId: string;
    signalType: "offer" | "answer" | "candidate";
    payload: object;
  }) => {
    const peer = getPeer();
    if (!peer) {
      console.warn("webrtc:signal received but no active peer", p);
      return;
    }
    try {
      if (p.signalType === "offer") {
        await peer.acquireMedia();
        await peer.acceptOffer(p.payload as RTCSessionDescriptionInit);
      } else if (p.signalType === "answer") {
        await peer.acceptAnswer(p.payload as RTCSessionDescriptionInit);
      } else if (p.signalType === "candidate") {
        await peer.addRemoteIce(p.payload as RTCIceCandidateInit);
      }
    } catch (err) {
      console.error(`webrtc:signal[${p.signalType}] failed:`, err);
    }
  };

  socket.on("call:incoming", onIncoming);
  socket.on("call:accept", onAccept);
  socket.on("call:reject", onReject);
  socket.on("call:end", onEnd);
  socket.on("webrtc:signal", onSignal);

  return () => {
    socket.off("call:incoming", onIncoming);
    socket.off("call:accept", onAccept);
    socket.off("call:reject", onReject);
    socket.off("call:end", onEnd);
    socket.off("webrtc:signal", onSignal);
  };
};
