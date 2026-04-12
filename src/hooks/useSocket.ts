import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { initSocket, getSocket, disconnectSocket } from "@/lib/socket";
import { addMessage } from "@/features/chat/chatSlice";
import { updateUserStatus } from "@/features/user/userSlice";
import { setPresence } from "@/features/presence/presenceSlice";
import {
  WS_CALL_ACCEPT,
  WS_CALL_END,
  WS_CALL_INCOMING,
  WS_CALL_INITIATE,
  WS_CALL_REJECT,
  WS_MESSAGE_ACK,
  WS_MESSAGE_DELIVERED,
  WS_MESSAGE_QUEUED,
  WS_READ_RECEIPT,
  WS_RECEIVE_MESSAGE,
  WS_SEND_MESSAGE,
  WS_TYPING,
  WS_USER_OFFLINE,
  WS_USER_ONLINE,
  WS_WEBRTC_SIGNAL,
} from "@/services/socket/events";

export const useSocket = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (token) {
      const socket = initSocket(token);
      socketRef.current = socket;

      // Listen for incoming messages
      socket.on(WS_RECEIVE_MESSAGE, (data: any) => {
        dispatch(addMessage(data));
      });

      socket.on(WS_USER_ONLINE, (data: any) => {
        dispatch(
          updateUserStatus({
            userId: data.userId,
            status: "online",
          })
        );
        dispatch(
          setPresence({
            userId: data.userId,
            status: "online",
            lastSeen: data.lastSeen,
          })
        );
      });

      socket.on(WS_USER_OFFLINE, (data: any) => {
        dispatch(
          updateUserStatus({
            userId: data.userId,
            status: "offline",
          })
        );
        dispatch(
          setPresence({
            userId: data.userId,
            status: "offline",
            lastSeen: data.lastSeen,
          })
        );
      });

      socket.on(WS_TYPING, () => {});
      socket.on(WS_MESSAGE_DELIVERED, () => {});
      socket.on(WS_READ_RECEIPT, () => {});
      socket.on(WS_MESSAGE_QUEUED, () => {});
      socket.on(WS_CALL_INCOMING, () => {});
      socket.on(WS_CALL_ACCEPT, () => {});
      socket.on(WS_CALL_REJECT, () => {});
      socket.on(WS_WEBRTC_SIGNAL, () => {});
      socket.on(WS_CALL_END, () => {});

      return () => {
        disconnectSocket();
      };
    }
  }, [token, dispatch]);

  const sendMessage = (conversationId: string, message: any) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(WS_SEND_MESSAGE, {
        conversationId,
        ...message,
      });
    }
  };

  const sendTypingIndicator = (conversationId: string, receiverId: string, isTyping = true) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(WS_TYPING, { conversationId, receiverId, isTyping });
    }
  };

  const sendMessageAck = (conversationId: string, messageId: string, status: "delivered" | "read" = "delivered") => {
    const socket = getSocket();
    if (socket) {
      socket.emit(WS_MESSAGE_ACK, { conversationId, messageId, status });
    }
  };

  const sendReadReceipt = (conversationId: string, lastReadSeq?: number) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(WS_READ_RECEIPT, { conversationId, lastReadSeq });
    }
  };

  const callInitiate = (conversationId: string, type: "audio" | "video" | "screen_share") => {
    const socket = getSocket();
    if (socket) {
      socket.emit(WS_CALL_INITIATE, { conversationId, type });
    }
  };

  const callAccept = (callId: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(WS_CALL_ACCEPT, { callId });
    }
  };

  const callReject = (callId: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(WS_CALL_REJECT, { callId });
    }
  };

  const sendWebrtcSignal = (
    callId: string,
    toUserId: string,
    signalType: "offer" | "answer" | "candidate",
    payload: Record<string, unknown>
  ) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(WS_WEBRTC_SIGNAL, { callId, toUserId, signalType, payload });
    }
  };

  const callEnd = (callId: string, endReason?: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(WS_CALL_END, { callId, endReason });
    }
  };

  const joinConversation = (conversationId: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("join_conversation", { conversationId });
    }
  };

  const leaveConversation = (conversationId: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("leave_conversation", { conversationId });
    }
  };

  return {
    socket: socketRef.current,
    sendMessage,
    sendTypingIndicator,
    sendMessageAck,
    sendReadReceipt,
    callInitiate,
    callAccept,
    callReject,
    sendWebrtcSignal,
    callEnd,
    joinConversation,
    leaveConversation,
  };
};
