import { checkOrigin } from "@/utils/checkOrigin";
import { NextResponse } from "next/server";
import {
  AuthError,
  createSession,
  registerUser,
} from "@/services/authService";

export async function POST(request: Request) {
  if (!checkOrigin(request)) {
    return NextResponse.json(
      { error: "Requête non autorisée." },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!name || !email || password.length < 6) {
      return NextResponse.json(
        {
          error:
            "Renseignez tous les champs et un mot de passe de 6 caractères minimum.",
        },
        { status: 400 },
      );
    }

    // Aucun choix de rôle envoyé depuis le navigateur.
    // Express attribue son rôle par défaut : client.
    const { token, user } = await registerUser({
      name,
      email,
      password,
    });

    await createSession(token);

    return NextResponse.json(
      { user },
      { status: 201 },
    );
  } catch (error) {
    const status =
      error instanceof AuthError ? error.status : 400;

    const message =
      error instanceof AuthError
        ? error.message
        : "Requête invalide.";

    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}
