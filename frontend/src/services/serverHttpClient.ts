import { API_URL } from "@/config/api";
import { httpClient } from "@/services/httpClient";

// Only import this adapter from server-side modules.
export const serverHttpClient = {
  get: <T>(path: string, token?: string) =>
    httpClient.get<T>(`${API_URL}${path}`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  request: <T>(path: string, method: "POST" | "DELETE", token: string) =>
    httpClient.request<T>(`${API_URL}${path}`, method, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }),
  post: <T, B>(path: string, body: B) =>
    httpClient.post<T, B>(`${API_URL}${path}`, body, { cache: "no-store" }),
};
