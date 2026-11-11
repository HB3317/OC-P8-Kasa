"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  favoriteService,
  getGuestFavorites,
  saveGuestFavorites,
  synchronizeGuestFavorites,
} from "@/services/favoriteService";

type FavoritesContextValue = {
  ids: string[];
  isReady: boolean;
  toggle: (id: string) => Promise<void>;
  error: string;
  retry: () => void;
};
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Fournit aux composants la liste des favoris et leur synchronisation entre stockage local et compte connecté.
 * La synchronisation échouée conserve les favoris locaux et expose un message d’erreur.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [isReady, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setError("");
    setReady(false);
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    let active = true;
    async function initialize() {
      setError("");
      const local = getGuestFavorites();
      try {
        const session = await favoriteService.session();
        if (session.authenticated) {
          await synchronizeGuestFavorites();
          const remote = await favoriteService.list();
          if (active) {
            setAuthenticated(true);
            setIds(remote.map((property) => String(property.id)));
          }
        } else if (active) {
          setIds(local);
        }
      } catch {
        if (active) {
          setIds(local);
          setError("Favoris du compte indisponibles. Réessayez plus tard.");
        }
      } finally {
        if (active) setReady(true);
      }
    }
    void initialize();
    return () => {
      active = false;
    };
  }, [retryCount]);

  const toggle = useCallback(
    async (id: string) => {
      if (!isReady) return;
      setError("");
      const selected = ids.includes(id);
      if (!authenticated) {
        const updated = selected
          ? ids.filter((entry) => entry !== id)
          : [...ids, id];
        setIds(updated);
        saveGuestFavorites(updated);
        return;
      }
      try {
        if (selected) await favoriteService.remove(id);
        else await favoriteService.add(id);
        setIds((current) =>
          selected ? current.filter((entry) => entry !== id) : [...current, id],
        );
      } catch {
        setError("Impossible de modifier vos favoris.");
      }
    },
    [authenticated, ids, isReady],
  );

  return (
    <FavoritesContext.Provider value={{ ids, isReady, toggle, error, retry }}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Accède au contexte des favoris et signale une utilisation hors du fournisseur.
 * @returns {FavoritesContextValue} État des favoris et actions disponibles.
 */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites requires FavoritesProvider");
  return context;
}
