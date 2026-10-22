import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/services/authService";
import { API_URL } from "@/config/api";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(_request: NextRequest, context: Context) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Connexion nécessaire." }, { status: 401 });
  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: "Conversation invalide." }, { status: 400 });
  try {
    const response = await fetch(`${API_URL}/api/conversations/${id}/read`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Serveur indisponible." }, { status: 502 }); }
}
