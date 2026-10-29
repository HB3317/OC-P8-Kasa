import NavLink from "@/components/atoms/NavLink/NavLink";
import styles from "@/styles/molecules/MobileNavigation.module.css";

type MobileNavigationProps = {
  pathname: string;
  isOpen: boolean;
  onNavigate: () => void;
  authenticated: boolean | null;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export default function MobileNavigation({
  pathname, isOpen, onNavigate, authenticated, isLoggingOut, onLogout,
}: MobileNavigationProps) {
  return (
    <nav id="mobile-navigation" aria-label="Navigation mobile"
      className={styles.navigation} hidden={!isOpen}>
      <div className={styles.links}>
        <NavLink href="/" isActive={pathname === "/"} onClick={onNavigate}>Accueil</NavLink>
        <NavLink href="/about" isActive={pathname === "/about"} onClick={onNavigate}>À propos</NavLink>
        <NavLink href="/messages" isActive={pathname === "/messages"} onClick={onNavigate}>Messagerie</NavLink>
        <NavLink href="/favorites" isActive={pathname === "/favorites"} onClick={onNavigate}>Favoris</NavLink>
        {authenticated === true ? (
          <button type="button" className={styles.authAction} disabled={isLoggingOut}
            onClick={onLogout}>
            {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
          </button>
        ) : authenticated === false ? (
          <NavLink href="/login" isActive={pathname === "/login"} onClick={onNavigate}>
            Se connecter
          </NavLink>
        ) : (
          <span className={styles.authPending} role="status">Vérification de la session...</span>
        )}
      </div>

      <NavLink href="/properties/new" isActive={pathname === "/properties/new"}
        onClick={onNavigate} className={styles.addProperty}>
        Ajouter un logement
      </NavLink>
    </nav>
  );
}
