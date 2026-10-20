import { useEffect, useState } from "react";

type MenuState = {
  pathname: string;
  open: boolean;
};

export function useMobileMenu(pathname: string) {
  const [menuState, setMenuState] = useState<MenuState>({
    pathname,
    open: false,
  });

  // Un menu ouvert sur une ancienne route doit être considéré fermé.
  const isOpen =
    menuState.pathname === pathname && menuState.open;

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
