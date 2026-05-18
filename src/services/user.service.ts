import { z } from "zod";
import { httpClient } from "@/lib/http/client";
import { unwrap } from "@/lib/http/envelope";
import { endpoints } from "./endpoints";
import {
  type User,
  type UserStatusInfo,
  userSchema,
  userStatusInfoSchema,
} from "@/schemas/user";

export const updateMeSchema = z.object({
  username: z.string().min(3).optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
});
export type UpdateMeRequest = z.infer<typeof updateMeSchema>;

export const userService = {
  getById: async (id: string): Promise<User> => {
    const res = await httpClient.get(endpoints.users.detail(id));
    return userSchema.parse(unwrap(res));
  },
  updateMe: async (body: UpdateMeRequest): Promise<User> => {
    const res = await httpClient.patch(endpoints.users.me, body);
    return userSchema.parse(unwrap(res));
  },
  search: async (q: string): Promise<User[]> => {
    const res = await httpClient.get(endpoints.users.search, { params: { q } });
    return z.array(userSchema).parse(unwrap(res));
  },
  getStatus: async (id: string): Promise<UserStatusInfo> => {
    const res = await httpClient.get(endpoints.users.status(id));
    return userStatusInfoSchema.parse(unwrap(res));
  },
  block: async (id: string): Promise<void> => {
    await httpClient.post(endpoints.users.block(id));
  },
};
