import { z } from "zod";
import { userStatusSchema } from "./user";

export const presenceSchema = z.object({
  userId: z.string(),
  status: userStatusSchema,
  lastSeen: z.string().optional(),
});
export type Presence = z.infer<typeof presenceSchema>;
