import styles from "@/styles/molecules/PropertyTags.module.css";

type Props = { tags: string[] };

export default function PropertyTags({ tags }: Props) {
  if (!tags.length) return null;
  return (
    <section aria-labelledby="category-title">
      <h2 id="category-title" className={styles.heading}>Catégorie</h2>
      <ul className={styles.list}>
        {tags.map((tag) => <li className={styles.tag} key={tag}>{tag}</li>)}
      </ul>
    </section>
  );
}
