"use client";

import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import styles from "@/styles/templates/NotFoundTemplate.module.css";

type Props = { onRetry: () => void };

/**
 * Conserve le header, le footer et l'identité visuelle de Kasa en cas d'erreur serveur.
 */
export default function ServerUnavailableTemplate({ onRetry }: Props) {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <p className={styles.description} role="alert">
            Service temporairement indisponible.
            <br className={styles.desktopBreak} /> Nous rencontrons actuellement
            un problème technique.
            <br /> Merci de réessayer ultérieurement.
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={onRetry}>
              Réessayer
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
