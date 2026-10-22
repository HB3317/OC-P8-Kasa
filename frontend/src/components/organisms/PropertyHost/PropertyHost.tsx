import Image from "next/image";
import type { PropertyDetail } from "@/types/property";
import styles from "@/styles/organisms/PropertyHost.module.css";

type Props = { host: PropertyDetail["host"]; rating: number | null };

export default function PropertyHost({ host, rating }: Props) {
  return (
    <aside aria-label="Informations sur l’hôte">
      <section className={styles.card} aria-labelledby="host-heading">
        <h2 id="host-heading" className={styles.heading}>Votre hôte</h2>
        <div className={styles.identity}>
          {host?.picture ? (
            <div className={styles.avatar}>
              <Image src={host.picture.startsWith("/uploads/") ? `/api/property-images/${encodeURIComponent(host.picture.slice(9))}` : host.picture} alt="" fill sizes="80px" className={styles.avatarImage} />
            </div>
          ) : <div className={styles.avatarPlaceholder} aria-hidden="true">⌂</div>}
          <p className={styles.name}>{host?.name ?? "Hôte non renseigné"}</p>
          {rating !== null && (
            <p className={styles.rating} aria-label={`Note de ${rating} sur 5`}>
              <span className={styles.star} aria-hidden="true">★</span>
              <span>{rating}</span>
            </p>
          )}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.button}>Contacter l&apos;hôte</button>
          <button type="button" className={styles.button}>Envoyer un message</button>
        </div>
      </section>
    </aside>
  );
}
