"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/atoms/Logo/Logo";
import LogoPicto from "@/components/quarks/LogoPicto";
import MenuToggleButton from "@/components/atoms/MenuToggleButton/MenuToggleButton";
import MainNavigation from "@/components/molecules/MainNavigation/MainNavigation";
import HeaderActions from "@/components/molecules/HeaderActions/HeaderActions";
import MobileNavigation from "@/components/molecules/MobileNavigation/MobileNavigation";

import { useMobileMenu } from "@/hooks/useMobileMenu";
import styles from "@/styles/organisms/Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu(pathname);

  return (
    <header className={styles.header} data-open={isOpen}>
      <div className={styles.container}>
        <div className={styles.desktopNavigation}>
          <MainNavigation pathname={pathname} />
        </div>

        <Link
          href="/"
          className={styles.desktopLogo}
          aria-label="Kasa - Accueil"
          onClick={closeMenu}
        >
          <Logo aria-hidden="true" />
        </Link>

        <div className={styles.desktopActions}>
          <HeaderActions pathname={pathname} />
        </div>

        <Link
          href="/"
          className={styles.mobileLogo}
          aria-label="Kasa - Accueil"
          onClick={closeMenu}
        >
          <LogoPicto aria-hidden="true" />
        </Link>

        <div className={styles.mobileToggle}>
          <MenuToggleButton
            isOpen={isOpen}
            onToggle={toggleMenu}
            controlsId="mobile-navigation"
          />
        </div>
      </div>

      <MobileNavigation
        pathname={pathname}
        isOpen={isOpen}
        onNavigate={closeMenu}
      />
    </header>
  );
}
