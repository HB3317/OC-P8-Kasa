"use client";

import HeartIcon from "@/components/quarks/HeartIcon";
import { useFavorites } from "@/hooks/useFavorites";
import styles from "@/styles/atoms/FavoriteButton.module.css";

export default function FavoriteButton({ propertyId }: { propertyId: string }) {
  const { ids, isReady, toggle, error } = useFavorites();
  const active = ids.includes(propertyId);
  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.button} disabled={!isReady}
        aria-pressed={active} aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
        onClick={() => void toggle(propertyId)}>
        <HeartIcon className={active ? styles.active : styles.inactive} />
      </button>
      {error && <span className={styles.error} role="alert">{error}</span>}
    </div>
  );
}
