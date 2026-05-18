import { z } from "zod";

export const mediaStatusSchema = z.enum([
  "uploading",
  "processing",
  "ready",
  "failed",
  "expired",
  "deleted",
]);
export type MediaStatus = z.infer<typeof mediaStatusSchema>;

export const mediaSchema = z.object({
  id: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  durationSec: z.number().optional(),
  cdnUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  storageKey: z.string().optional(),
  status: mediaStatusSchema,
});
export type Media = z.infer<typeof mediaSchema>;

export const presignQuerySchema = z.object({
  originalName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  durationSec: z.number().optional(),
});
export type PresignQuery = z.infer<typeof presignQuerySchema>;

export const presignResponseSchema = z.object({
  mediaId: z.string(),
  storageKey: z.string(),
  uploadUrl: z.string(),
  expiresAt: z.string(),
  method: z.string(),
  headers: z.record(z.string(), z.string()).optional(),
});
export type PresignResponse = z.infer<typeof presignResponseSchema>;

export const confirmUploadSchema = z.object({
  mediaId: z.string(),
  cdnUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  storageKey: z.string().optional(),
});
export type ConfirmUploadRequest = z.infer<typeof confirmUploadSchema>;
