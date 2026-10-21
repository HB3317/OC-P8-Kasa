import PropertyCard from "@/components/molecules/PropertyCard/PropertyCard";
import type { Property } from "@/types/property";
import styles from "@/styles/organisms/PropertyGrid.module.css";

type Props = { properties: Property[] };

export default function PropertyGrid({ properties }: Props) {
  if (properties.length === 0) {
    return <p className={styles.empty}>Aucun logement disponible pour le moment.</p>;
  }

  return (
    <section aria-label="Logements disponibles" className={styles.grid}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </section>
  );
}
