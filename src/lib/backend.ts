type QueryValue = string | number | boolean | null | undefined;

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, "");
const trimLeadingSlash = (value: string): string => value.replace(/^\/+/, "");

export const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  process.env.NEXT_PUBLIC_API_ORIGIN ||
  "http://localhost:3000";

export const BACKEND_API_PREFIX = process.env.NEXT_PUBLIC_BACKEND_API_PREFIX || "/api";

export const getApiBaseUrl = (): string => {
  const origin = trimTrailingSlash(BACKEND_ORIGIN);
  const prefix = trimLeadingSlash(BACKEND_API_PREFIX);
  return `${origin}/${prefix}`;
};

export const buildPath = (
  template: string,
  params?: Record<string, string | number>
): string => {
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce((path, [key, value]) => {
    return path.replace(new RegExp(`:${key}(?=/|$)`, "g"), encodeURIComponent(String(value)));
  }, template);
};

export const buildQuery = (query?: Record<string, QueryValue>): string => {
  if (!query) {
    return "";
  }

  const entries = Object.entries(query).filter(([, value]) => value !== undefined && value !== null);
  if (entries.length === 0) {
    return "";
  }

  const searchParams = new URLSearchParams();
  entries.forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const buildEndpoint = (
  template: string,
  params?: Record<string, string | number>,
  query?: Record<string, QueryValue>
): string => {
  const path = buildPath(template, params);
  const queryString = buildQuery(query);
  return `${path}${queryString}`;
};
