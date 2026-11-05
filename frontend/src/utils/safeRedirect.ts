/**
 * N’autorise que les chemins internes sûrs après authentification et exclut les pages de connexion et d’inscription.
 * @returns {string} Destination validée ou page d’accueil.
 */
export function safeRedirect(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  try {
    const destination = new URL(value, "http://localhost");
    if (destination.origin !== "http://localhost") return "/";
    if (destination.pathname === "/login" || destination.pathname === "/register") return "/";
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/";
  }
}

/**
 * Construit une URL de connexion avec une destination de retour préalablement sécurisée.
 */
export function loginDestination(path: string): string {
  return `/login?next=${encodeURIComponent(safeRedirect(path))}`;
}
