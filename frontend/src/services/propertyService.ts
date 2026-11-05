import { serverHttpClient } from "@/services/serverHttpClient";
import { HttpError } from "@/services/httpClient";
import type { PropertyDetail } from "@/types/property";
import type { Property } from "@/types/property";

/**
 * Récupère la liste publique des logements depuis le backend Express.
 */
export function getProperties(): Promise<Property[]> {
  return serverHttpClient.get<Property[]>("/api/properties");
}

/**
 * Récupère un logement ; retourne null pour une ressource absente et propage les autres erreurs.
 */
export async function getProperty(id: string): Promise<PropertyDetail | null> {
  try { return await serverHttpClient.get<PropertyDetail>(`/api/properties/${encodeURIComponent(id)}`); }
  catch (error) { if (error instanceof HttpError && error.status === 404) return null; throw error; }
}
