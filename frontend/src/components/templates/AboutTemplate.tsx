import Image from "next/image";
import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import styles from "@/styles/templates/AboutTemplate.module.css";

export default function AboutTemplate() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <section className={styles.intro} aria-labelledby="about-title">
          <h1 id="about-title">À propos</h1>
          <p>Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se sentir bien.</p>
          <p>
            Depuis notre création, nous mettons en relation des voyageurs en quête d’authenticité
            avec des hôtes passionnés qui aiment partager leur région et leurs bonnes adresses.
          </p>
        </section>

        <div className={styles.hero}>
          <Image
            src="/images/about-hero.jpg"
            alt="Maison en bois entourée d'arbres à la lumière du soir"
            fill
            priority
            sizes="(max-width: 800px) calc(100vw - 48px), 1114px"
            className={styles.image}
          />
        </div>

        <section className={styles.mission} aria-labelledby="mission-title">
          <div className={styles.missionText}>
            <h2 id="mission-title">Notre mission est simple :</h2>
            <ol>
              <li>Offrir une plateforme fiable et simple d’utilisation</li>
              <li>Proposer des hébergements variés et de qualité</li>
              <li>Favoriser des échanges humains et chaleureux entre hôtes et voyageurs</li>
            </ol>
          </div>
          <div className={styles.missionImage}>
            <Image
              src="/images/about-mission.jpg"
              alt="Maison en bois avec une grande façade vitrée"
              fill
              sizes="(max-width: 800px) calc(100vw - 32px), 495px"
              className={styles.image}
            />
          </div>
          <p className={styles.missionClosing}>
            Que vous cherchiez un appartement cosy en centre-ville, une maison en bord de mer
            ou un chalet à la montagne, Kasa vous accompagne pour que chaque séjour devienne
            un souvenir inoubliable.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
