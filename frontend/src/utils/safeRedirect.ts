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

export function loginDestination(path: string): string {
  return `/login?next=${encodeURIComponent(safeRedirect(path))}`;
}
