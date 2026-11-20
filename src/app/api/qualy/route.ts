import { NextRequest, NextResponse } from "next/server";
import { getQualyMode, qualyRespond } from "@/lib/qualy-provider";

const MAX_MESSAGE_LENGTH = 2000;
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

function clientKey(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

function cleanupRateMap() {
  const now = Date.now();
  for (const [key, entry] of rateMap.entries()) {
    if (now > entry.resetAt) rateMap.delete(key);
  }
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  if (rateMap.size > 200) cleanupRateMap();

  const entry = rateMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const key = clientKey(req);
    if (!checkRateLimit(key)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Espera un momento." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }

    const message =
      body && typeof body === "object" && "message" in body
        ? (body as { message: unknown }).message
        : null;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    const trimmed = message.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Mensaje demasiado largo (máx. ${MAX_MESSAGE_LENGTH} caracteres)` },
        { status: 400 }
      );
    }

    if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(trimmed)) {
      return NextResponse.json(
        { error: "Mensaje contiene caracteres no permitidos" },
        { status: 400 }
      );
    }

    const { reply, provider } = await qualyRespond(trimmed);
    return NextResponse.json({ reply, provider });
  } catch (err) {
    console.error("[qualy] unexpected error", err);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado. Por favor intenta otra vez." },
      { status: 500 }
    );
  }
}

/** GET: estado del proveedor (sin secretos). Útil para verificar configuración. */
export async function GET() {
  const mode = getQualyMode();
  return NextResponse.json({
    status: "ok",
    mode,
    message:
      mode === "azure"
        ? "Qualy está usando Azure OpenAI."
        : "Qualy está en modo local (configura AZURE_OPENAI_* para activar Azure).",
  });
}
