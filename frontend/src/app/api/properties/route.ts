import { NextResponse } from "next/server";
import { getProperties } from "@/services/propertyService";
export async function GET() {
  try { return NextResponse.json(await getProperties(), { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "Logements indisponibles." }, { status: 502 }); }
}
