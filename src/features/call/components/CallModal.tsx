"use client";

import { useEffect, useRef } from "react";
import { useCallStore } from "../store";
import { useAcceptCall, useCallMedia, useEndCall, useRejectCall } from "../api";

export function CallModal() {
  const callId = useCallStore((s) => s.callId);
  const status = useCallStore((s) => s.status);
  const type = useCallStore((s) => s.type);
  const isIncoming = useCallStore((s) => s.isIncoming);
  const audioEnabled = useCallStore((s) => s.audioEnabled);
  const videoEnabled = useCallStore((s) => s.videoEnabled);
  const localStream = useCallStore((s) => s.localStream);
  const remoteStream = useCallStore((s) => s.remoteStream);

  const accept = useAcceptCall();
  const reject = useRejectCall();
  const end = useEndCall();
  const { toggleAudio, toggleVideo } = useCallMedia();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);
  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  if (!callId) return null;

  const isRinging = status === "ringing";
  const isOngoing = status === "ongoing";
  const isVideo = type === "video";
  const statusLabel = isRinging
    ? isIncoming
      ? "Incoming call..."
      : "Calling..."
    : isOngoing
    ? "Connected"
    : status ?? "";

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      <div className="relative flex-1">
        {isVideo ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover bg-gray-900"
          />
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-700 mx-auto mb-4" />
                <p className="text-2xl">{statusLabel}</p>
              </div>
            </div>
            <audio ref={remoteAudioRef} autoPlay />
          </>
        )}

        {isVideo && localStream && (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-4 right-4 w-40 h-28 rounded-lg object-cover bg-gray-800 border-2 border-white/30"
          />
        )}

        {isVideo && (
          <p className="absolute top-4 left-4 text-white text-sm bg-black/40 px-3 py-1 rounded">
            {statusLabel}
          </p>
        )}
      </div>

      <div className="bg-black/70 p-6 flex items-center justify-center gap-4">
        {isIncoming && isRinging ? (
          <>
            <button
              onClick={() => reject.mutate()}
              className="px-6 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-700"
            >
              Decline
            </button>
            <button
              onClick={() => accept.mutate()}
              disabled={accept.isPending}
              className="px-6 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {accept.isPending ? "Connecting..." : "Accept"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => toggleAudio(!audioEnabled)}
              className={`px-4 py-2 rounded-full text-white ${
                audioEnabled ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
              }`}
              aria-pressed={!audioEnabled}
            >
              {audioEnabled ? "Mute" : "Unmute"}
            </button>
            {isVideo && (
              <button
                onClick={() => toggleVideo(!videoEnabled)}
                className={`px-4 py-2 rounded-full text-white ${
                  videoEnabled ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
                }`}
                aria-pressed={!videoEnabled}
              >
                {videoEnabled ? "Camera off" : "Camera on"}
              </button>
            )}
            <button
              onClick={() => end.mutate("normal")}
              className="px-6 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-700"
            >
              End
            </button>
          </>
        )}
      </div>
    </div>
  );
}
