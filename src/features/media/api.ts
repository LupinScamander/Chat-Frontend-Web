"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { mediaService } from "@/services/media.service";
import { queryKeys } from "@/lib/query/keys";
import type { ConfirmUploadRequest, PresignQuery } from "@/schemas/media";

export const useMedia = (id: string) =>
  useQuery({
    queryKey: queryKeys.media.detail(id),
    queryFn: () => mediaService.getById(id),
    enabled: !!id,
  });

export const usePresignUpload = () =>
  useMutation({ mutationFn: (query: PresignQuery) => mediaService.presign(query) });

export const useConfirmUpload = () =>
  useMutation({ mutationFn: (body: ConfirmUploadRequest) => mediaService.confirm(body) });

/**
 * Upload flow:
 * 1. presign → get { uploadUrl, mediaId, method, headers }
 * 2. PUT/POST the file directly to uploadUrl (not via httpClient — it's S3-like)
 * 3. confirm(mediaId) → server flips media status to ready
 */
export const uploadFile = async (file: File, presign: { uploadUrl: string; method: string; headers?: Record<string, string> }) => {
  const res = await fetch(presign.uploadUrl, {
    method: presign.method,
    headers: presign.headers,
    body: file,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
};
