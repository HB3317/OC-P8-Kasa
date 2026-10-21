import LocationIcon from "@/components/quarks/LocationIcon";
import PropertyEquipmentList from "@/components/molecules/PropertyEquipmentList/PropertyEquipmentList";
import PropertyTags from "@/components/molecules/PropertyTags/PropertyTags";
import type { PropertyDetail } from "@/types/property";
import styles from "@/styles/organisms/PropertyInformation.module.css";

type Props = { property: PropertyDetail };

export default function PropertyInformation({ property }: Props) {
  return (
    <section className={styles.card} aria-labelledby="property-title">
      <h1 id="property-title" className={styles.title}>{property.title}</h1>
      {property.location && (
        <p className={styles.location}>
          <LocationIcon className={styles.locationIcon} />
          <span>{property.location}</span>
        </p>
      )}
      {property.description && <p className={styles.description}>{property.description}</p>}
      <div className={styles.sections}>
        <PropertyEquipmentList equipments={property.equipments} />
        <PropertyTags tags={property.tags} />
      </div>
    </section>
  );
}
