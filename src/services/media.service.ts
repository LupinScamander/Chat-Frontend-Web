import { httpClient } from "@/lib/http/client";
import { unwrap } from "@/lib/http/envelope";
import { endpoints } from "./endpoints";
import {
  type ConfirmUploadRequest,
  type Media,
  type PresignQuery,
  type PresignResponse,
  mediaSchema,
  presignResponseSchema,
} from "@/schemas/media";

export const mediaService = {
  presign: async (query: PresignQuery): Promise<PresignResponse> => {
    const res = await httpClient.get(endpoints.media.presign, { params: query });
    return presignResponseSchema.parse(unwrap(res));
  },
  confirm: async (body: ConfirmUploadRequest): Promise<Media> => {
    const res = await httpClient.post(endpoints.media.confirm, body);
    return mediaSchema.parse(unwrap(res));
  },
  getById: async (id: string): Promise<Media> => {
    const res = await httpClient.get(endpoints.media.detail(id));
    return mediaSchema.parse(unwrap(res));
  },
};
