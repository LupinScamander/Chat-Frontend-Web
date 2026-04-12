export interface FriendRequestPayload {
  receiverId: string;
  message?: string;
}

export type FriendRequestStatus = "accepted" | "declined" | "cancelled";

export interface FriendRespondPayload {
  requestId: string;
  status: FriendRequestStatus;
}

export interface FriendRequestItem {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  message?: string;
  createdAt?: string;
}
