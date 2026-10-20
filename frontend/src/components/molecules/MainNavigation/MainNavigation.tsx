import NavLink from "@/components/atoms/NavLink/NavLink";
import styles from "@/styles/molecules/MainNavigation.module.css";

type MainNavigationProps = {
  pathname: string;
};

export default function MainNavigation({
  pathname,
}: MainNavigationProps) {
  return (
    <nav
      aria-label="Navigation principale"
      className={styles.navigation}
    >
      <NavLink href="/" isActive={pathname === "/"}>
        Accueil
      </NavLink>

      <NavLink href="/about" isActive={pathname === "/about"}>
        À propos
      </NavLink>
    </nav>
  );
}
