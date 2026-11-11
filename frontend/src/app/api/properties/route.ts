import { NextResponse } from "next/server";
import { getProperties } from "@/services/propertyService";
/**
 * Expose au navigateur la liste des logements provenant du backend.
 */
export async function GET() {
  try {
    return NextResponse.json(await getProperties(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Logements indisponibles." },
      { status: 502 },
    );
  }
}
