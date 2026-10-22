import { NextRequest, NextResponse } from "next/server";
import { createSession, getSessionToken } from "@/services/authService";
import { API_URL } from "@/config/api";

type CurrentUser = { id: number; name: string; picture: string | null; role: "client" | "owner" | "admin" };
type PublishedProperty = { id: string; host?: { id: number } };
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

async function api<T>(path: string, token: string, method = "GET", body?: BodyInit, isJson = false): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method, cache: "no-store",
    headers: { Authorization: `Bearer ${token}`, ...(isJson ? { "Content-Type": "application/json" } : {}) },
    body,
  });
  const result = await response.json().catch(() => null) as (T & { error?: string }) | null;
  if (!response.ok) throw new Error(result?.error || `Erreur API (${response.status}).`);
  if (!result) throw new Error("Réponse API invalide.");
  return result;
}

async function upload(file: File, token: string, purpose: string): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("purpose", purpose);
  const result = await api<{ url: string }>("/api/uploads/image", token, "POST", body);
  if (!result.url?.startsWith("/uploads/")) throw new Error("URL de photo invalide.");
  return result.url;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) return NextResponse.json({ error: "Origine non autorisée." }, { status: 403 });
  const originalToken = await getSessionToken();
  if (!originalToken) return NextResponse.json({ error: "Connexion nécessaire." }, { status: 401 });

  let token = originalToken;
  let initialRole: CurrentUser["role"] | undefined;
  let userId: number | undefined;
  let promoted = false;
  let propertyCreated = false;
  let creationAttempted = false;
  const uploaded: string[] = [];

  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8")) as { id?: number; email?: string };
    if (!Number.isSafeInteger(payload.id) || !payload.id || payload.id < 1) return NextResponse.json({ error: "Session invalide." }, { status: 401 });
    userId = payload.id;
    const user = await api<CurrentUser>(`/api/users/${userId}`, token);
    initialRole = user.role;
    const form = await request.formData();
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    const price = Number(form.get("price_per_night"));
    const equipments = JSON.parse(String(form.get("equipments") ?? "[]")) as unknown;
    const tags = JSON.parse(String(form.get("tags") ?? "[]")) as unknown;
    const cover = form.get("cover");
    const pictures = form.getAll("pictures");
    const avatar = form.get("avatar");
    const validStrings = (items: unknown, max: number) => Array.isArray(items) && items.length <= max && items.every(x => typeof x === "string" && x.trim().length > 0 && x.length <= 60);
    if (title.length < 5 || title.length > 120 || description.length < 20 || description.length > 5000 || location.length < 2 || location.length > 120 || !Number.isFinite(price) || price < 1 || price > 100000 || !Number.isInteger(price) || !validStrings(equipments, 30) || (equipments as string[]).length === 0 || !validStrings(tags, 20)) {
      return NextResponse.json({ error: "Vérifie les champs obligatoires du formulaire." }, { status: 400 });
    }
    if (!(cover instanceof File) || pictures.length > 12 || pictures.some(f => !(f instanceof File)) || (avatar !== null && !(avatar instanceof File))) return NextResponse.json({ error: "Photos invalides." }, { status: 400 });
    const files = [cover, ...pictures as File[], ...(avatar instanceof File ? [avatar] : [])];
    if (files.some(f => f.size <= 0 || f.size > MAX_IMAGE_SIZE || !["image/jpeg", "image/png", "image/webp"].includes(f.type))) return NextResponse.json({ error: "Images JPEG/PNG/WebP uniquement, 10 Mo maximum." }, { status: 400 });

    if (initialRole === "client") {
      const password = String(form.get("confirmation_password") ?? "");
      if (!password || !payload.email) return NextResponse.json({ error: "Confirme ton mot de passe pour publier ta première annonce." }, { status: 400 });
      // Confirm credentials before any role change.
      await api<{ token: string }>("/auth/login", "", "POST", JSON.stringify({ email: payload.email, password }), true);
      await api<CurrentUser>(`/api/users/${userId}`, token, "PATCH", JSON.stringify({ role: "owner" }), true);
      promoted = true;
      const renewed = await api<{ token: string }>("/auth/login", "", "POST", JSON.stringify({ email: payload.email, password }), true);
      if (!renewed.token) throw new Error("Renouvellement de session impossible.");
      token = renewed.token;
    }

    const coverUrl = await upload(cover, token, "property-cover"); uploaded.push(coverUrl);
    const imageUrls: string[] = [];
    for (const file of pictures as File[]) { const url = await upload(file, token, "property-picture"); uploaded.push(url); imageUrls.push(url); }
    // The account photo is not changed unless a new image was explicitly chosen.
    // From this point on, a lost response does not prove that Express failed to create the property.
    creationAttempted = true;
    const result = await api<PublishedProperty>("/api/properties", token, "POST", JSON.stringify({
      title, description, location, price_per_night: price,
      host_id: userId, cover: coverUrl, pictures: imageUrls, equipments, tags,
    }), true);
    if (!result.id) throw new Error("La création n'a pas retourné d'identifiant.");
    propertyCreated = true;
    if (avatar instanceof File) {
      try { const avatarUrl = await upload(avatar, token, "user-picture"); uploaded.push(avatarUrl); await api<CurrentUser>(`/api/users/${userId}`, token, "PATCH", JSON.stringify({ picture: avatarUrl }), true); }
      catch { /* Profile photo is optional: do not undo a published listing. */ }
    }
    // The property is already committed: an optional cookie failure must never report publication failure.
    let sessionWarning: string | undefined;
    if (promoted) {
      try { await createSession(token); }
      catch { sessionWarning = "Annonce publiée, mais actualisation de session impossible. Reconnecte-toi pour utiliser ton compte propriétaire."; }
    }
    return NextResponse.json({ id: result.id, ...(sessionWarning ? { warning: sessionWarning } : {}) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Publication impossible.";
    // Safe cleanup only before any property-creation request was dispatched.
    // After POST, the response can be lost even though the property exists in SQLite.
    if (!creationAttempted && !propertyCreated && uploaded.length) {
      try { await api<unknown>("/api/uploads/images", token, "DELETE", JSON.stringify({ urls: uploaded }), true); }
      catch { /* Best effort: orphan files are safer than deleting published pictures. */ }
    }
    // Only undo our own promotion when this request never attempted property creation.
    if (!creationAttempted && promoted && userId) {
      // Re-read the current state: another tab may already have published a property.
      // If verification is unavailable, leave owner intact rather than demoting a real host.
      let canRevert = false;
      try {
        const listings = await api<Array<{ host?: { id?: number }; host_id?: number }>>("/api/properties", token);
        canRevert = Array.isArray(listings) && listings.every(p => p.host?.id !== userId && p.host_id !== userId);
      } catch { /* State unknown: do not demote. */ }
      if (canRevert) try { await api<CurrentUser>(`/api/users/${userId}`, token, "PATCH", JSON.stringify({ role: "client" }), true); }
      catch { /* Do not conceal original failure. */ }
    }
    if (creationAttempted && !propertyCreated) {
      return NextResponse.json({
        error: "Publication non confirmée. Vérifie tes annonces avant de réessayer pour éviter un doublon.",
      }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
