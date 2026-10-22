import NavLink from "@/components/atoms/NavLink/NavLink";
import styles from "@/styles/molecules/MobileNavigation.module.css";

type MobileNavigationProps = {
  pathname: string;
  isOpen: boolean;
  onNavigate: () => void;
};

export default function MobileNavigation({
  pathname, isOpen, onNavigate,
}: MobileNavigationProps) {
  return (
    <nav id="mobile-navigation" aria-label="Navigation mobile"
      className={styles.navigation} hidden={!isOpen}>
      <div className={styles.links}>
        <NavLink href="/" isActive={pathname === "/"} onClick={onNavigate}>Accueil</NavLink>
        <NavLink href="/about" isActive={pathname === "/about"} onClick={onNavigate}>À propos</NavLink>
        <NavLink href="/messages" isActive={pathname === "/messages"} onClick={onNavigate}>Messagerie</NavLink>
        <NavLink href="/favorites" isActive={pathname === "/favorites"} onClick={onNavigate}>Favoris</NavLink>
      </div>

      <NavLink href="/properties/new" isActive={pathname === "/properties/new"}
        onClick={onNavigate} className={styles.addProperty}>
        Ajouter un logement
      </NavLink>


    </nav>
  );
}
