import { checkOrigin } from "@/utils/checkOrigin";
import { NextResponse } from "next/server";
import {
  AuthError,
  createSession,
  loginUser,
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
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe obligatoires." },
        { status: 400 },
      );
    }

    const { token, user } = await loginUser({
      email,
      password,
    });

    await createSession(token);

    return NextResponse.json({ user });
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
