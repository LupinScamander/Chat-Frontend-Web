import { User } from "@/types";

export interface UpdateProfileRequest {
  username?: string;
  avatar?: string;
  bio?: string;
  phoneNumber?: string;
}

export interface SearchUsersQuery {
  q: string;
}

export interface UserStatusResponse {
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

export interface UserProfile extends User {
  bio?: string;
  phoneNumber?: string;
  username?: string;
}
