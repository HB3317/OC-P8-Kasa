/**
 * Convertit les chemins de fichiers téléversés par Express vers le proxy d’images Next.js.
 * Les URLs déjà externes ou non concernées sont conservées telles quelles.
 */
export function resolveUploadImage(src: string): string {
  if (!src.startsWith("/uploads/")) return src;
  return "/api/property-images/" + encodeURIComponent(src.slice("/uploads/".length));
}
