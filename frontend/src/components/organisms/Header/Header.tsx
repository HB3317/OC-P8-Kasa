"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import Logo from "@/components/atoms/Logo/Logo";
import LogoPicto from "@/components/quarks/LogoPicto";
import MenuToggleButton from "@/components/atoms/MenuToggleButton/MenuToggleButton";
import MainNavigation from "@/components/molecules/MainNavigation/MainNavigation";
import HeaderActions from "@/components/molecules/HeaderActions/HeaderActions";
import MobileNavigation from "@/components/molecules/MobileNavigation/MobileNavigation";
import { logout } from "@/services/clientAuthService";
import { httpClient } from "@/services/httpClient";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import styles from "@/styles/organisms/Header.module.css";

type SessionResponse = { authenticated: boolean };

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu(pathname);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    let cancelled = false;
    httpClient.get<SessionResponse>("/api/auth/session", { cache: "no-store" })
      .then((session) => {
        if (!cancelled) setAuthenticated(session.authenticated);
      })
      .catch(() => {
        if (!cancelled) setAuthenticated(null);
      });
    return () => { cancelled = true; };
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      setAuthenticated(false);
      closeMenu();
      router.replace("/");
      router.refresh();
    } catch {
      setLogoutError("Déconnexion impossible. Réessayez.");
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, closeMenu, router]);

  return (
    <header className={styles.header} data-open={isOpen}>
      <div className={styles.container}>
        <div className={styles.desktopNavigation}>
          <MainNavigation pathname={pathname} />
        </div>

        <Link href="/" className={styles.desktopLogo} aria-label="Kasa - Accueil">
          <Logo aria-hidden="true" />
        </Link>

        <div className={styles.desktopActions}>
          <HeaderActions
            pathname={pathname}
            authenticated={authenticated}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
          />
        </div>

        <Link href="/" className={styles.mobileLogo} aria-label="Kasa - Accueil" onClick={closeMenu}>
          <LogoPicto aria-hidden="true" />
        </Link>

        <div className={styles.mobileToggle}>
          <MenuToggleButton isOpen={isOpen} onToggle={toggleMenu} controlsId="mobile-navigation" />
        </div>
      </div>

      {logoutError && <p className={styles.authError} role="alert">{logoutError}</p>}
      <MobileNavigation
        pathname={pathname}
        isOpen={isOpen}
        onNavigate={closeMenu}
        authenticated={authenticated}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
      />
    </header>
  );
}
