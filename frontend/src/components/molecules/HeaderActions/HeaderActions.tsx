import NavLink from "@/components/atoms/NavLink/NavLink";
import AuthActionMenu from "@/components/molecules/AuthActionMenu/AuthActionMenu";
import HeartIcon from "@/components/quarks/HeartIcon";
import MessageIcon from "@/components/quarks/MessageIcon";

import styles from "@/styles/molecules/HeaderActions.module.css";

type HeaderActionsProps = {
  pathname: string;
  authenticated: boolean | null;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export default function HeaderActions({
  pathname, authenticated, isLoggingOut, onLogout,
}: HeaderActionsProps) {
  return (
    <nav aria-label="Actions utilisateur" className={styles.actions}>
      <NavLink href="/properties/new" isActive={pathname === "/properties/new"} className={styles.addProperty}>
        + Ajouter un logement
      </NavLink>

      <NavLink href="/favorites" isActive={pathname === "/favorites"} className={styles.iconLink}>
        <HeartIcon aria-hidden="true" />
        <span className={styles.visuallyHidden}>Favoris</span>
      </NavLink>

      <NavLink href="/messages" isActive={pathname === "/messages"} className={styles.iconLink}>
        <MessageIcon aria-hidden="true" />
        <span className={styles.visuallyHidden}>Messagerie</span>
      </NavLink>

      <AuthActionMenu
        authenticated={authenticated}
        isLoggingOut={isLoggingOut}
        onLogout={onLogout}
      />
    </nav>
  );
}
