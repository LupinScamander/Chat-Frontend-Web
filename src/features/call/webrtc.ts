import { getSocket } from "@/lib/socket/client";
import { useCallStore } from "./store";

const ICE_SERVERS: RTCIceServer[] = [{ urls: ["stun:stun.l.google.com:19302"] }];

interface PeerOptions {
  callId: string;
  remoteUserId: string;
  /** true = caller (will makeOffer after accept); false = callee. */
  isCaller: boolean;
  /** Initial media constraints. */
  audio?: boolean;
  video?: boolean;
}

class CallPeer {
  pc: RTCPeerConnection;
  localStream: MediaStream | null = null;
  private pendingIce: RTCIceCandidateInit[] = [];

  constructor(private opts: PeerOptions) {
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    this.pc.ontrack = (e) => {
      const stream = e.streams[0];
      if (stream) useCallStore.getState().setRemoteStream(stream);
    };

    this.pc.onicecandidate = (e) => {
      if (!e.candidate) return;
      getSocket()?.emit("webrtc:signal", {
        callId: opts.callId,
        toUserId: opts.remoteUserId,
        signalType: "candidate",
        payload: e.candidate.toJSON(),
      });
    };

    this.pc.onconnectionstatechange = () => {
      const s = this.pc.connectionState;
      if (s === "connected") useCallStore.getState().setStatus("ongoing");
      if (s === "failed" || s === "disconnected") useCallStore.getState().setStatus("failed");
    };
  }

  async acquireMedia(): Promise<MediaStream> {
    if (this.localStream) return this.localStream;
    const constraints: MediaStreamConstraints = {
      audio: this.opts.audio !== false,
      video: this.opts.video === true,
    };
    this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
    this.localStream.getTracks().forEach((t) => this.pc.addTrack(t, this.localStream!));
    useCallStore.getState().setLocalStream(this.localStream);
    return this.localStream;
  }

  async makeOffer(): Promise<void> {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    getSocket()?.emit("webrtc:signal", {
      callId: this.opts.callId,
      toUserId: this.opts.remoteUserId,
      signalType: "offer",
      payload: { type: offer.type, sdp: offer.sdp },
    });
  }

  async acceptOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    await this.pc.setRemoteDescription(offer);
    await this.drainPendingIce();
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    getSocket()?.emit("webrtc:signal", {
      callId: this.opts.callId,
      toUserId: this.opts.remoteUserId,
      signalType: "answer",
      payload: { type: answer.type, sdp: answer.sdp },
    });
  }

  async acceptAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    await this.pc.setRemoteDescription(answer);
    await this.drainPendingIce();
  }

  async addRemoteIce(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.pc.remoteDescription) {
      this.pendingIce.push(candidate);
      return;
    }
    try {
      await this.pc.addIceCandidate(candidate);
    } catch (err) {
      console.warn("addIceCandidate failed:", err);
    }
  }

  private async drainPendingIce(): Promise<void> {
    const queued = this.pendingIce;
    this.pendingIce = [];
    for (const c of queued) {
      try {
        await this.pc.addIceCandidate(c);
      } catch (err) {
        console.warn("drain ice failed:", err);
      }
    }
  }

  setAudioEnabled(enabled: boolean): void {
    this.localStream?.getAudioTracks().forEach((t) => (t.enabled = enabled));
  }

  setVideoEnabled(enabled: boolean): void {
    this.localStream?.getVideoTracks().forEach((t) => (t.enabled = enabled));
  }

  close(): void {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.localStream = null;
    this.pc.close();
  }
}

let activePeer: CallPeer | null = null;

export const startPeer = (opts: PeerOptions): CallPeer => {
  if (activePeer) activePeer.close();
  activePeer = new CallPeer(opts);
  return activePeer;
};

export const getPeer = (): CallPeer | null => activePeer;

export const closePeer = (): void => {
  activePeer?.close();
  activePeer = null;
};
