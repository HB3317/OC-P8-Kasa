import styles from "@/styles/molecules/PropertyEquipmentList.module.css";

type Props = { equipments: string[] };

export default function PropertyEquipmentList({ equipments }: Props) {
  return (
    <section aria-labelledby="equipment-title">
      <h2 id="equipment-title" className={styles.heading}>Équipements</h2>
      {equipments.length ? (
        <ul className={styles.grid}>
          {equipments.map((item) => <li className={styles.item} key={item}>{item}</li>)}
        </ul>
      ) : <p className={styles.empty}>Aucun équipement renseigné.</p>}
    </section>
  );
}
