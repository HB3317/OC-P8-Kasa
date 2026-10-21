import { NextResponse } from "next/server";
import { checkOrigin } from "@/utils/checkOrigin";
import { getSessionUser, getSessionToken } from "@/services/authService";
import { serverHttpClient } from "@/services/serverHttpClient";
import { HttpError } from "@/services/httpClient";

type Context = { params: Promise<{ id: string }> };

async function mutate(request: Request, context: Context, method: "POST" | "DELETE") {
  if (!checkOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  const user = await getSessionUser();
  const token = await getSessionToken();
  if (!user || !token) return NextResponse.json({ error: "Connexion nécessaire." }, { status: 401 });
  const { id } = await context.params;
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  try {
    const result = await serverHttpClient.request<{ ok: boolean }>(`/api/properties/${encodeURIComponent(id)}/favorite`, method, token);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof HttpError ? error.message : "Erreur serveur." }, { status: error instanceof HttpError ? error.status : 502 });
  }
}

export const POST = (request: Request, context: Context) => mutate(request, context, "POST");
export const DELETE = (request: Request, context: Context) => mutate(request, context, "DELETE");
