import { serverHttpClient } from "@/services/serverHttpClient";
import type { Property } from "@/types/property";

export function getProperties(): Promise<Property[]> {
  return serverHttpClient.get<Property[]>("/api/properties");
}
