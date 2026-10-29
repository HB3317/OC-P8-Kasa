import { httpClient } from "@/services/httpClient";
import type { Conversation, Message } from "@/types/messaging";

const noCache = { cache: "no-store" as const };

export const messagingService = {
  list: () =>
    httpClient.get<Conversation[]>("/api/conversations", noCache),

  openForProperty: (propertyId: string) =>
    httpClient.post<{ id: number }, { propertyId: string }>(
      "/api/conversations",
      { propertyId },
      noCache,
    ),

  messages: (id: number) =>
    httpClient.get<Message[]>(`/api/conversations/${id}/messages`, noCache),

  send: (id: number, body: string) =>
    httpClient.post<Message, { body: string }>(
      `/api/conversations/${id}/messages`,
      { body },
      noCache,
    ),

  markRead: (id: number) =>
    httpClient.patch<{ ok: boolean }, Record<string, never>>(
      `/api/conversations/${id}/read`,
      {},
      noCache,
    ),
};
