import Link from "next/link";
import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import styles from "@/styles/templates/NotFoundTemplate.module.css";

export default function NotFoundTemplate() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.code}>404</h1>
          <p className={styles.description}>
            Il semble que la page que vous cherchez ait pris
            <br className={styles.desktopBreak} /> des vacances... ou n’ait jamais existé.
          </p>
          <nav className={styles.actions} aria-label="Navigation depuis la page introuvable">
            <Link href="/" className={styles.button}>Accueil</Link>
            <Link href="/" className={styles.button}>Logements</Link>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
}
