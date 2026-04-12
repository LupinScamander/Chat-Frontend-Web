import { api } from "@/lib/axios";
import { assertObject, safeString, unwrapData } from "@/middleware/http";
import {
  GET_MEDIA_BY_ID,
  GET_MEDIA_PRESIGN,
  PATCH_MEDIA_STATUS,
  POST_MEDIA,
  POST_MEDIA_CONFIRM,
} from "@/services/media/endpoints";
import { MediaConfirmRequest, MediaMeta, MediaPresignQuery, MediaPresignResponse } from "@/services/media/types";

const normalizeMediaMeta = (value: unknown): MediaMeta => {
  const raw = assertObject<Record<string, unknown>>(value, "Invalid media metadata");
  return {
    id: safeString(raw.id || raw.mediaId),
    status: safeString(raw.status, "unknown"),
    cdnUrl: safeString(raw.cdnUrl) || undefined,
    thumbnailUrl: safeString(raw.thumbnailUrl) || undefined,
    mimeType: safeString(raw.mimeType) || undefined,
  };
};

export const mediaService = {
  getPresign: async (query: MediaPresignQuery): Promise<MediaPresignResponse> => {
    const response = await api.get(GET_MEDIA_PRESIGN, { params: query });
    const data = assertObject<Record<string, unknown>>(unwrapData<unknown>(response), "Invalid media presign payload");
    return {
      mediaId: safeString(data.mediaId),
      storageKey: safeString(data.storageKey),
      uploadUrl: safeString(data.uploadUrl),
      expiresAt: safeString(data.expiresAt),
      method: safeString(data.method, "PUT"),
      headers: (data.headers as Record<string, string>) || undefined,
    };
  },

  confirmUpload: async (payload: MediaConfirmRequest): Promise<MediaMeta> => {
    const response = await api.post(POST_MEDIA_CONFIRM, payload);
    return normalizeMediaMeta(unwrapData<unknown>(response));
  },

  getById: async (id: string): Promise<MediaMeta> => {
    const response = await api.get(GET_MEDIA_BY_ID(id));
    return normalizeMediaMeta(unwrapData<unknown>(response));
  },

  createLegacy: async (payload: Record<string, unknown>): Promise<MediaMeta> => {
    const response = await api.post(POST_MEDIA, payload);
    return normalizeMediaMeta(unwrapData<unknown>(response));
  },

  updateStatusLegacy: async (id: string, status: string): Promise<MediaMeta> => {
    const response = await api.patch(PATCH_MEDIA_STATUS, null, {
      params: { id, status },
    });
    return normalizeMediaMeta(unwrapData<unknown>(response));
  },
};
