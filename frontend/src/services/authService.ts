import { cookies } from "next/headers";
import { serverHttpClient } from "@/services/serverHttpClient";
import { HttpError } from "@/services/httpClient";
import type { AuthResult, AuthUser } from "@/types/auth";



const COOKIE_NAME = "kasa_session";
const SESSION_DURATION = 7 * 24 * 60 * 60;

type Credentials = {
  email: string;
  password: string;
};

type Registration = Credentials & {
  name: string;
};

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

// Send authentication requests to the Express API.
async function requestAuth(
  path: string,
  body: Credentials | Registration,
): Promise<AuthResult> {
  try {
    const result = await serverHttpClient.post<AuthResult, Credentials | Registration>(
      `/auth/${path}`,
      body,
    );

    if (!result.token || !result.user?.id) {
      throw new AuthError("Réponse d'authentification invalide.", 502);
    }
    return result;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    if (error instanceof HttpError) {
      if (error.status === 401) throw new AuthError("Identifiants incorrects.", 401);
      if (error.status === 409) throw new AuthError("Cette adresse email est déjà utilisée.", 409);
      if (error.status === 400) throw new AuthError("Vérifiez les informations saisies.", 400);
      if (error.status === 503) throw new AuthError("Serveur indisponible.", 503);
    }
    throw new AuthError("Une erreur est survenue.", 502);
  }
}

export async function loginUser(
  credentials: Credentials,
): Promise<AuthResult> {
  return requestAuth("login", credentials);
}

export async function registerUser(
  registration: Registration,
): Promise<AuthResult> {
  return requestAuth("register", registration);
}

// Store the JWT in an HttpOnly cookie.
export async function createSession(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

// Remove the session cookie on logout.
export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}

// Retrieve the authenticated user from the current session.
export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    // Decode the JWT payload only to extract the user ID.
    // Express validates the token's authenticity.
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url")
        .toString("utf8"),
    );

    const id = payload.id;

    if (!Number.isSafeInteger(id) || id <= 0) {
      return null;
    }

    const user = await serverHttpClient.get<AuthUser>(`/api/users/${id}`, token);
    return {
      id: user.id,
      name: user.name,
      email: payload.email ?? null,
      picture: user.picture ?? null,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function getSessionToken(): Promise<string | null> {
  return (await cookies()).get(COOKIE_NAME)?.value ?? null;
}
