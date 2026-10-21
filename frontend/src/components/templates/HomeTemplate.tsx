import Image from "next/image";
import { FavoritesProvider } from "@/hooks/useFavorites";
import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import PropertyGrid from "@/components/organisms/PropertyGrid/PropertyGrid";
import type { Property } from "@/types/property";
import styles from "@/styles/templates/HomeTemplate.module.css";

type Props = { properties: Property[] };

export default function HomeTemplate({ properties }: Props) {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Chez vous, partout et ailleurs</h1>
          <p>Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes.</p>
        </section>
        <div className={styles.hero}>
          <Image
            src="/images/home-hero.jpg"
            alt="Maison contemporaine en bois au milieu des herbes hautes"
            fill
            priority
            sizes="(max-width: 800px) calc(100vw - 32px), 1114px"
            className={styles.heroImage}
          />
        </div>
        <FavoritesProvider><PropertyGrid properties={properties} /></FavoritesProvider>
        <section className={styles.how} aria-labelledby="how-title">
          <h2 id="how-title">Comment ça marche ?</h2>
          <p>Que vous partiez pour un week-end improvisé, des vacances en famille ou un voyage professionnel, Kasa vous aide à trouver un lieu qui vous ressemble.</p>
          <div className={styles.steps}>
            <div className={styles.step}><h3>Recherchez</h3><p>Entrez votre destination, vos dates et laissez Kasa faire le reste.</p></div>
            <div className={styles.step}><h3>Réservez</h3><p>Profitez d’une plateforme sécurisée et de profils d’hôtes vérifiés.</p></div>
            <div className={styles.step}><h3>Vivez l’expérience</h3><p>Installez-vous, profitez de votre séjour, et sentez-vous chez vous, partout.</p></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
