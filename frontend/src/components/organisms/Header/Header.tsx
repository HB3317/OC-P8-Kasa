"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileAuthOpen, setMobileAuthOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileAuthRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!desktopMenuOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (!desktopMenuRef.current?.contains(event.target as Node)) {
        setDesktopMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDesktopMenuOpen(false);
        desktopMenuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [desktopMenuOpen]);

  useEffect(() => {
    if (!mobileAuthOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!mobileAuthRef.current?.contains(event.target as Node)) setMobileAuthOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileAuthOpen(false);
        mobileAuthRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileAuthOpen]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      setAuthenticated(false);
      setDesktopMenuOpen(false);
      setMobileAuthOpen(false);
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

        <div className={styles.desktopLogoMenu} ref={desktopMenuRef}>
          <button
            type="button"
            className={styles.desktopLogo}
            aria-label="Kasa - Menu de connexion"
            aria-haspopup="menu"
            aria-expanded={desktopMenuOpen}
            aria-controls="desktop-auth-menu"
            onClick={() => setDesktopMenuOpen((open) => !open)}
          >
            <Logo aria-hidden="true" />
          </button>
          {desktopMenuOpen && (
            <div id="desktop-auth-menu" className={styles.authMenu} role="menu">
              {authenticated === true ? (
                <button type="button" role="menuitem" disabled={isLoggingOut}
                  onClick={() => void handleLogout()}>
                  {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                </button>
              ) : authenticated === false ? (
                <Link role="menuitem" href="/login" onClick={() => setDesktopMenuOpen(false)}>
                  Se connecter
                </Link>
              ) : (
                <span className={styles.authLoading}>Vérification...</span>
              )}
              {logoutError && <span className={styles.authError} role="alert">{logoutError}</span>}
            </div>
          )}
        </div>

        <div className={styles.desktopActions}>
          <HeaderActions pathname={pathname} />
        </div>

        <div className={styles.mobileLogoMenu} ref={mobileAuthRef}>
          <button type="button" className={styles.mobileLogo}
            aria-label="Kasa - Menu de connexion"
            aria-haspopup="menu" aria-expanded={mobileAuthOpen} aria-controls="mobile-auth-menu"
            onClick={() => { closeMenu(); setMobileAuthOpen(open => !open); }}>
            <LogoPicto aria-hidden="true" />
          </button>
          {mobileAuthOpen && (
            <div id="mobile-auth-menu" className={styles.authMenu} role="menu">
              {authenticated === true ? (
                <button type="button" role="menuitem" disabled={isLoggingOut}
                  onClick={() => void handleLogout()}>
                  {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                </button>
              ) : authenticated === false ? (
                <Link role="menuitem" href="/login" onClick={() => setMobileAuthOpen(false)}>
                  Se connecter
                </Link>
              ) : <span className={styles.authLoading}>Vérification...</span>}
              {logoutError && <span className={styles.authError} role="alert">{logoutError}</span>}
            </div>
          )}
        </div>

        <div className={styles.mobileToggle}>
          <MenuToggleButton isOpen={isOpen} onToggle={() => { setMobileAuthOpen(false); toggleMenu(); }} controlsId="mobile-navigation" />
        </div>
      </div>

      <MobileNavigation pathname={pathname} isOpen={isOpen} onNavigate={closeMenu} />
    </header>
  );
}
