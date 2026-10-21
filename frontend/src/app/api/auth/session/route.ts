import { NextResponse } from "next/server";
import { getSessionUser } from "@/services/authService";

export async function GET() {
  const user = await getSessionUser();

  return NextResponse.json(
    { authenticated: Boolean(user), user },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
