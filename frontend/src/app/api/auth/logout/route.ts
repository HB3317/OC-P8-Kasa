import { checkOrigin } from "@/utils/checkOrigin";
import { NextResponse } from "next/server";
import {
  deleteSession,
} from "@/services/authService";

export async function POST(request: Request) {
  if (!checkOrigin(request)) {
    return NextResponse.json(
      { error: "Requête non autorisée." },
      { status: 403 },
    );
  }

  await deleteSession();

  return NextResponse.json({ ok: true });
}
