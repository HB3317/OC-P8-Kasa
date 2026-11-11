import { useEffect, useState } from "react";

type MenuState = {
  pathname: string;
  open: boolean;
};

/**
 * Gère l’ouverture du menu mobile et le referme après un changement de page ou la touche Échap.
 * @param {string} pathname Chemin courant.
 * @returns État et commandes du menu.
 */
export function useMobileMenu(pathname: string) {
  const [menuState, setMenuState] = useState<MenuState>({
    pathname,
    open: false,
  });

  // Un menu ouvert sur une autre page doit être considéré comme fermé.
  const isOpen = menuState.pathname === pathname && menuState.open;

  function closeMenu() {
    setMenuState({ pathname, open: false });
  }

  function toggleMenu() {
    setMenuState({ pathname, open: !isOpen });
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuState((previous) => ({
          ...previous,
          open: false,
        }));
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return { isOpen, toggleMenu, closeMenu };
}
