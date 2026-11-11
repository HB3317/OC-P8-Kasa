import { URL_PUBLIC } from "@/config/URL";

/**
 * Vérifie que l’en-tête Origin correspond à l’origine de la requête pour filtrer les appels intersites.
 * @param {Request} request Requête entrante.
 * @returns {boolean} Vrai uniquement pour une origine explicitement identique.
 */
export function checkOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) return false;

  const requestOrigin = new URL(request.url).origin;
  const publicOrigin = new URL(URL_PUBLIC).origin;

  return origin === requestOrigin || origin === publicOrigin;
}
