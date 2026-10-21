import { httpClient } from "@/services/httpClient";
import type { Property } from "@/types/property";

const STORAGE_KEY = "kasa_guest_favorites";

type Session = { authenticated: boolean };

export function getGuestFavorites(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string"))] : [];
  } catch { return []; }
}

export function saveGuestFavorites(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)]));
}

export const favoriteService = {
  session: () => httpClient.get<Session>("/api/auth/session", { cache: "no-store" }),
  list: () => httpClient.get<Property[]>("/api/favorites", { cache: "no-store" }),
  add: (id: string) => httpClient.post<{ ok: boolean }, Record<string, never>>(`/api/favorites/${encodeURIComponent(id)}`, {}),
  remove: (id: string) => httpClient.delete<{ ok: boolean }>(`/api/favorites/${encodeURIComponent(id)}`),
};

export async function synchronizeGuestFavorites(): Promise<void> {
  const ids = getGuestFavorites();
  if (!ids.length) return;
  // Keep unsynchronized favorites locally if any request fails.
  const saved = await favoriteService.list();
  const existing = new Set(saved.map((property) => String(property.id)));
  const remaining = [...ids];
  for (const id of ids) {
    try {
      if (!existing.has(id)) await favoriteService.add(id);
      remaining.splice(remaining.indexOf(id), 1);
      saveGuestFavorites(remaining);
    } catch {
      // A failed item remains local and can be retried later.
    }
  }
}
