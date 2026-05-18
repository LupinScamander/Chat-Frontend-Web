import axios from "axios";
import { getApiBaseUrl } from "@/lib/env";
import { attachInterceptors } from "./interceptors";

export const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

attachInterceptors(httpClient);
