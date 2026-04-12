import { AxiosResponse } from "axios";

export interface ApiEnvelope<T> {
  data: T;
  paging?: {
    cursor?: number | string | null;
    limit?: number;
    total?: number;
    hasNext?: boolean;
  };
}

export const unwrapData = <T>(response: AxiosResponse<ApiEnvelope<T> | T>): T => {
  const payload = response.data as ApiEnvelope<T> | T;
  if (
    payload &&
    typeof payload === "object" &&
    "data" in (payload as Record<string, unknown>)
  ) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
};

export const assertObject = <T>(value: unknown, fallbackMessage: string): T => {
  if (!value || typeof value !== "object") {
    throw new Error(fallbackMessage);
  }
  return value as T;
};

export const assertArray = <T>(value: unknown, fallbackMessage: string): T[] => {
  if (!Array.isArray(value)) {
    throw new Error(fallbackMessage);
  }
  return value as T[];
};

export const safeString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return fallback;
};
