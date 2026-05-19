import type { AppSocket } from "@/lib/socket/client";
import type { CallStatus, CallType } from "@/schemas/call";
import { useCallStore } from "./store";

type Unbind = () => void;

export const bindCallSocket = (socket: AppSocket): Unbind => {
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
      isIncoming: true,
    });
  };
  const onAccept = () => useCallStore.getState().setStatus("ongoing");
  const onReject = () => useCallStore.getState().setStatus("declined");
  const onEnd = (p: { callId: string; status: CallStatus }) => {
    useCallStore.getState().setStatus(p.status);
    setTimeout(() => useCallStore.getState().end(), 800);
  };

  socket.on("call:incoming", onIncoming);
  socket.on("call:accept", onAccept);
  socket.on("call:reject", onReject);
  socket.on("call:end", onEnd);

  return () => {
    socket.off("call:incoming", onIncoming);
    socket.off("call:accept", onAccept);
    socket.off("call:reject", onReject);
    socket.off("call:end", onEnd);
  };
};
