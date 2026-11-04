/** Résout les images /uploads/ servies par Express via le proxy Next existant. */
export function resolveUploadImage(src: string): string {
  if (!src.startsWith("/uploads/")) return src;
  return "/api/property-images/" + encodeURIComponent(src.slice("/uploads/".length));
}
