import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import { FavoritesProvider } from "@/hooks/useFavorites";
import FavoriteButton from "@/components/atoms/FavoriteButton/FavoriteButton";
import { getProperty } from "@/services/propertyService";
import { getSessionUser } from "@/services/authService";
import styles from "@/styles/templates/PropertyDetail.module.css";

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();
  const user = await getSessionUser();
  return <div className={styles.page}><Header /><main className={styles.main}>
    <h1>{property.title}</h1>
    <p>{property.location}</p>
    <div className={styles.imageArea}>
      {property.cover && <Image src={property.cover} alt={property.title} fill sizes="(max-width: 800px) 100vw, 1100px" className={styles.image} />}
      <FavoritesProvider><FavoriteButton propertyId={String(property.id)} /></FavoritesProvider>
    </div>
    <p>{property.description}</p>
    <p><strong>{property.price_per_night} €</strong> par nuit</p>
    {user ? <p>Réservation : fonctionnalité à développer.</p> : <a href={`/login?next=${encodeURIComponent(`/properties/${id}?reserve=1`)}`}>Connectez-vous pour réserver</a>}
  </main><Footer /></div>;
}
