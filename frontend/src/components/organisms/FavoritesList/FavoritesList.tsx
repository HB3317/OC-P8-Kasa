"use client";

import { useEffect, useState } from "react";
import PropertyGrid from "@/components/organisms/PropertyGrid/PropertyGrid";
import { useFavorites } from "@/hooks/useFavorites";
import { favoriteService } from "@/services/favoriteService";
import { httpClient } from "@/services/httpClient";
import type { Property } from "@/types/property";

export default function FavoritesList() {
  const { ids, isReady, error } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!isReady) return;
    let active = true;
    async function load() {
      try {
        const session = await favoriteService.session();
        const all = session.authenticated ? await favoriteService.list() : await httpClient.get<Property[]>("/api/properties");
        if (active) setProperties(all);
      } catch { if (active) setProperties([]); }
      finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [isReady]);
  if (!isReady || loading) return <p>Chargement des favoris...</p>;
  return <>{error && <p role="alert">{error}</p>}<PropertyGrid properties={properties.filter((property) => ids.includes(String(property.id)))} /></>;
}
