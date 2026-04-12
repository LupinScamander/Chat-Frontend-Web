export interface MediaPresignQuery {
  originalName: string;
  mimeType: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  durationSec?: number;
}

export interface MediaPresignResponse {
  mediaId: string;
  storageKey: string;
  uploadUrl: string;
  expiresAt: string;
  method: string;
  headers?: Record<string, string>;
}

export interface MediaConfirmRequest {
  mediaId: string;
  cdnUrl?: string;
  thumbnailUrl?: string;
  storageKey?: string;
}

export interface MediaMeta {
  id: string;
  status: string;
  cdnUrl?: string;
  thumbnailUrl?: string;
  mimeType?: string;
}
