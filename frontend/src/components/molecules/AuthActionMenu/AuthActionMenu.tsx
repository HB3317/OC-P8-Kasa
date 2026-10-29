"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AuthActionButton from "@/components/atoms/AuthActionButton/AuthActionButton";
import styles from "@/styles/molecules/AuthActionMenu.module.css";

type AuthActionMenuProps = {
  authenticated: boolean | null;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export default function AuthActionMenu({ authenticated, isLoggingOut, onLogout }: AuthActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isLoading = authenticated === null || isLoggingOut;

  return (
    <div className={styles.root} ref={rootRef}>
      <AuthActionButton
        isOpen={isOpen}
        disabled={isLoading}
        onClick={() => setIsOpen((current) => !current)}
      />
      {isOpen && (
        <div className={styles.dropdown}>
          {authenticated ? (
            <button type="button" className={styles.action} disabled={isLoggingOut}
              onClick={() => { setIsOpen(false); onLogout(); }}>
              Se déconnecter
            </button>
          ) : (
            <Link href="/login" className={styles.action} onClick={() => setIsOpen(false)}>
              Se connecter
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
