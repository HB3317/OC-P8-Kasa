import { serverHttpClient } from "@/services/serverHttpClient";
import { HttpError } from "@/services/httpClient";
import type { PropertyDetail } from "@/types/property";
import type { Property } from "@/types/property";

export function getProperties(): Promise<Property[]> {
  return serverHttpClient.get<Property[]>("/api/properties");
}

export async function getProperty(id: string): Promise<PropertyDetail | null> {
  try { return await serverHttpClient.get<PropertyDetail>(`/api/properties/${encodeURIComponent(id)}`); }
  catch (error) { if (error instanceof HttpError && error.status === 404) return null; throw error; }
}
