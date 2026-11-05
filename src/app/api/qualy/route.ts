import { NextRequest, NextResponse } from "next/server";
import { qualyThink } from "@/lib/qualy-brain";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    // Inteligencia local — sin APIs de pago
    const reply = qualyThink(message);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Qualy API error:", error);
    return NextResponse.json({
      reply: "Ocurrió un error inesperado. Por favor intenta otra vez.",
    });
  }
}
