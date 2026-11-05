/**
 * Interprète les horodatages transmis par Express comme des dates UTC.
 */
function parseUtc(date: string): Date {
  const normalized = date.replace(" ", "T");
  return new Date(normalized + (normalized.includes("Z") ? "" : "Z"));
}

/**
 * Formate l’heure d’un message selon la locale française ; renvoie une chaîne vide si la date est absente ou invalide.
 */
export function messageTime(date: string | null): string {
  if (!date) return "";
  const parsed = parseUtc(date);
  return Number.isNaN(parsed.getTime())
    ? ""
    : new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(parsed);
}

/**
 * Formate le jour d’un message en français ; renvoie une chaîne vide si la date est invalide.
 */
export function messageDay(date: string): string {
  const parsed = parseUtc(date);
  return Number.isNaN(parsed.getTime())
    ? ""
    : new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(parsed);
}
