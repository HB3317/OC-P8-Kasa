import LogoPicto from "@/components/quarks/LogoPicto";
import styles from "@/styles/organisms/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <LogoPicto aria-hidden="true" />

        <p>© 2025 Kasa. All rights reserved</p>
      </div>
    </footer>
  );
}
