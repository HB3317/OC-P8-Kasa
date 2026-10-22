import Image from "next/image";
import FavoriteButton from "@/components/atoms/FavoriteButton/FavoriteButton";
import Link from "next/link";
import type { Property } from "@/types/property";
import styles from "@/styles/molecules/PropertyCard.module.css";

type Props = { property: Property };

export default function PropertyCard({ property }: Props) {
  return (
    <article className={styles.card}>
      <Link className={styles.link} href={`/properties/${property.id}`}>
        <div className={styles.picture}>
          {property.cover ? (
            <Image
              src={property.cover.startsWith("/uploads/") ? `/api/property-images/${encodeURIComponent(property.cover.slice(9))}` : property.cover}
              alt={property.title}
              fill
              sizes="(max-width: 800px) calc(100vw - 32px), (max-width: 1200px) 45vw, 360px"
              className={styles.image}
            />
          ) : (
            <span className={styles.placeholder}>Photo indisponible</span>
          )}
        </div>
        <div className={styles.details}>
          <h2 className={styles.title}>{property.title}</h2>
          <p className={styles.location}>{property.location}</p>
          <p className={styles.price}>
            <strong>{property.price_per_night} €</strong> par nuit
          </p>
        </div>
      </Link>
      <FavoriteButton propertyId={String(property.id)} />
    </article>
  );
}
