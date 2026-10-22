import Link from "next/link";
import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import PropertyCarousel from "@/components/molecules/PropertyCarousel/PropertyCarousel";
import PropertyInformation from "@/components/organisms/PropertyInformation/PropertyInformation";
import PropertyHost from "@/components/organisms/PropertyHost/PropertyHost";
import FavoriteButton from "@/components/atoms/FavoriteButton/FavoriteButton";
import { FavoritesProvider } from "@/hooks/useFavorites";
import type { PropertyDetail } from "@/types/property";
import styles from "@/styles/templates/PropertyDetail.module.css";

type Props = { property: PropertyDetail };

export default function PropertyDetailTemplate({ property }: Props) {
  const images = [property.cover, ...property.pictures]
    .filter((image): image is string => Boolean(image))
    .filter((image, index, list) => list.indexOf(image) === index);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <Link className={styles.backLink} href="/">← Retour aux annonces</Link>
        <div className={styles.layout}>
          <div className={styles.primary}>
            <PropertyCarousel images={images.map(image => image.startsWith("/uploads/") ? `/api/property-images/${encodeURIComponent(image.slice(9))}` : image)} title={property.title}>
              <FavoritesProvider><FavoriteButton propertyId={String(property.id)} /></FavoritesProvider>
            </PropertyCarousel>
            <PropertyInformation property={property} />
          </div>
          <PropertyHost host={property.host} rating={property.rating_avg} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
