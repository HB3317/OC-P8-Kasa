"use client";

import { useEffect, useState } from "react";
import PropertyGrid from "@/components/organisms/PropertyGrid/PropertyGrid";
import { useFavorites } from "@/hooks/useFavorites";
import { favoriteService } from "@/services/favoriteService";
import { httpClient } from "@/services/httpClient";
import type { Property } from "@/types/property";
import styles from "@/styles/organisms/FavoritesList.module.css";

/**
 * Affiche les favoris filtrés et différencie l’absence de logement d’un échec réseau.
 * Le bouton de nouvelle tentative recharge la page afin de réinitialiser également le contexte des favoris.
 */
export default function FavoritesList() {
  const { ids, isReady, error, retry } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    let active = true;

    async function load() {
      try {
        const session = await favoriteService.session();
        const all = session.authenticated
          ? await favoriteService.list()
          : await httpClient.get<Property[]>("/api/properties");
        if (active) {
          setProperties(all);
          setLoadError(false);
        }
      } catch {
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [isReady]);

  if (!isReady || loading) return <p>Chargement des favoris...</p>;

  if (loadError) {
    return (
      <div className={styles.errorState}>
        <p role="alert">Impossible de charger vos favoris pour le moment.</p>
        {error && <p role="alert">{error}</p>}
        <button
          className={styles.retryButton}
          type="button"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p role="alert">{error}</p>
        <button className={styles.retryButton} type="button" onClick={retry}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <PropertyGrid
      properties={properties.filter((property) =>
        ids.includes(String(property.id)),
      )}
    />
  );
}
