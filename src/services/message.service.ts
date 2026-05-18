import { z } from "zod";
import { httpClient } from "@/lib/http/client";
import { unwrap } from "@/lib/http/envelope";
import { endpoints } from "./endpoints";
import { type ListMessagesQuery, type Message, messageSchema } from "@/schemas/message";

export const messageService = {
  list: async (query: ListMessagesQuery): Promise<Message[]> => {
    const res = await httpClient.get(endpoints.messages.list, { params: query });
    return z.array(messageSchema).parse(unwrap(res));
  },
};
