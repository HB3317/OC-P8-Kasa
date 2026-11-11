import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import FavoritesList from "@/components/organisms/FavoritesList/FavoritesList";
import { FavoritesProvider } from "@/hooks/useFavorites";
import styles from "@/styles/templates/HomeTemplate.module.css";

export default function FavoritesPage() {
  return (
    <div className={`${styles.page} ${styles.favoritesPage}`}>
      <Header />
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Vos favoris</h1>
          <p>
            Retrouvez ici tous les logements que vous avez aimés.
            <br />
            Prêts à réserver ? Un simple clic et votre prochain séjour est en
            route.
          </p>
        </div>
        <FavoritesProvider>
          <FavoritesList />
        </FavoritesProvider>
      </main>
      <Footer />
    </div>
  );
}
