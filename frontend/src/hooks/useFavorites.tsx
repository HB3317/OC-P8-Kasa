"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { favoriteService, getGuestFavorites, saveGuestFavorites, synchronizeGuestFavorites } from "@/services/favoriteService";

type FavoritesContextValue = {
  ids: string[];
  isReady: boolean;
  toggle: (id: string) => Promise<void>;
  error: string;
};
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [isReady, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function initialize() {
      const local = getGuestFavorites();
      try {
        const session = await favoriteService.session();
        if (session.authenticated) {
          await synchronizeGuestFavorites();
          const remote = await favoriteService.list();
          if (active) { setAuthenticated(true); setIds(remote.map((property) => String(property.id))); }
        } else if (active) { setIds(local); }
      } catch {
        if (active) { setIds(local); setError("Favoris du compte indisponibles. Réessayez plus tard."); }
      } finally { if (active) setReady(true); }
    }
    void initialize();
    return () => { active = false; };
  }, []);

  const toggle = useCallback(async (id: string) => {
    if (!isReady) return;
    setError("");
    const selected = ids.includes(id);
    if (!authenticated) {
      const updated = selected ? ids.filter((entry) => entry !== id) : [...ids, id];
      setIds(updated);
      saveGuestFavorites(updated);
      return;
    }
    try {
      if (selected) await favoriteService.remove(id);
      else await favoriteService.add(id);
      setIds((current) => selected ? current.filter((entry) => entry !== id) : [...current, id]);
    } catch { setError("Impossible de modifier vos favoris."); }
  }, [authenticated, ids, isReady]);

  return <FavoritesContext.Provider value={{ ids, isReady, toggle, error }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites requires FavoritesProvider");
  return context;
}
