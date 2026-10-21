import { NextResponse } from "next/server";
import { getSessionUser, getSessionToken } from "@/services/authService";
import { serverHttpClient } from "@/services/serverHttpClient";
import { HttpError } from "@/services/httpClient";
import type { Property } from "@/types/property";

export async function GET() {
  const user = await getSessionUser();
  const token = await getSessionToken();
  if (!user || !token) return NextResponse.json({ error: "Connexion nécessaire." }, { status: 401 });
  try {
    const properties = await serverHttpClient.get<Property[]>(`/api/users/${user.id}/favorites`, token);
    return NextResponse.json(properties, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: "Favoris indisponibles." }, { status: error instanceof HttpError ? error.status : 502 });
  }
}
