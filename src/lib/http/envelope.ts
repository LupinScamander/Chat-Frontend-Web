import type { AxiosResponse } from "axios";
import type { z } from "zod";

export interface Envelope<T> {
  data: T;
  paging?: {
    cursor?: number | string | null;
    limit?: number;
    total?: number;
    hasNext?: boolean;
  };
}

export const unwrap = <T>(response: AxiosResponse<Envelope<T> | T>): T => {
  const payload = response.data as Envelope<T> | T;
  if (
    payload &&
    typeof payload === "object" &&
    "data" in (payload as Record<string, unknown>)
  ) {
    return (payload as Envelope<T>).data;
  }
  return payload as T;
};

export const getPaging = <T>(response: AxiosResponse<Envelope<T> | T>): Envelope<T>["paging"] => {
  const payload = response.data as Envelope<T> | T;
  if (
    payload &&
    typeof payload === "object" &&
    "paging" in (payload as Record<string, unknown>)
  ) {
    return (payload as Envelope<T>).paging;
  }
  return undefined;
};

export const parseUnwrapped = <S extends z.ZodTypeAny>(
  schema: S,
  response: AxiosResponse,
): z.infer<S> => schema.parse(unwrap(response));
