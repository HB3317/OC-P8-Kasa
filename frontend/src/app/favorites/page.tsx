import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import FavoritesList from "@/components/organisms/FavoritesList/FavoritesList";
import { FavoritesProvider } from "@/hooks/useFavorites";
import styles from "@/styles/templates/HomeTemplate.module.css";

export default function FavoritesPage() {
  return <div className={styles.page}><Header /><main className={styles.main}>
    <h1>Mes favoris</h1>
    <FavoritesProvider><FavoritesList /></FavoritesProvider>
  </main><Footer /></div>;
}
