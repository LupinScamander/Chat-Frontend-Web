import axios, { type AxiosError } from "axios";

export class ApiError extends Error {
  status: number;
  data?: unknown;
  code?: string;

  constructor(message: string, status: number, data?: unknown, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.code = code;
  }
}

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    const e = error as AxiosError<{ message?: string; code?: string }>;
    return new ApiError(
      e.response?.data?.message ?? e.message ?? "Request failed",
      e.response?.status ?? 0,
      e.response?.data,
      e.response?.data?.code,
    );
  }
  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }
  return new ApiError("Unknown error", 0);
};
