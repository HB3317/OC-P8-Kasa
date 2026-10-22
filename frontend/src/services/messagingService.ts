import type { Conversation, Message } from "@/types/messaging";

type Method = "GET" | "POST" | "PATCH";

async function request<T>(path: string, method: Method = "GET", body?: object): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "Une erreur est survenue.");
  }

  return response.json() as Promise<T>;
}

export const messagingService = {
  list: () => request<Conversation[]>("/api/conversations"),
  openForProperty: (propertyId: string) =>
    request<{ id: number }>("/api/conversations", "POST", { propertyId }),
  messages: (id: number) => request<Message[]>(`/api/conversations/${id}/messages`),
  send: (id: number, body: string) =>
    request<Message>(`/api/conversations/${id}/messages`, "POST", { body }),
  markRead: (id: number) =>
    request<{ ok: boolean }>(`/api/conversations/${id}/read`, "PATCH"),
};
