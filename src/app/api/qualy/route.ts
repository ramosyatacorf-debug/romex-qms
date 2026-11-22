import { NextRequest, NextResponse } from "next/server";
import {
  getQualyMode,
  qualyRespond,
  qualyRespondStream,
  type StreamEvent,
} from "@/lib/qualy-provider";

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

function parseMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const msg = (body as { message?: unknown }).message;
  if (typeof msg !== "string") return null;
  const trimmed = msg.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_MESSAGE_LENGTH) return null;
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(trimmed)) return null;
  return trimmed;
}

function sseLine(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
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

    const trimmed = parseMessage(body);
    if (!trimmed) {
      const raw =
        body && typeof body === "object" && "message" in body
          ? (body as { message: unknown }).message
          : null;
      if (typeof raw === "string" && raw.trim().length > MAX_MESSAGE_LENGTH) {
        return NextResponse.json(
          { error: `Mensaje demasiado largo (máx. ${MAX_MESSAGE_LENGTH} caracteres)` },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    const wantStream =
      body &&
      typeof body === "object" &&
      "stream" in body &&
      (body as { stream?: unknown }).stream === true;

    if (wantStream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const send = (event: StreamEvent) => {
            controller.enqueue(encoder.encode(sseLine(event)));
          };
          try {
            await qualyRespondStream(trimmed, send);
          } catch (err) {
            console.error("[qualy] stream error", err);
            send({
              type: "error",
              message:
                err instanceof Error
                  ? err.message
                  : "Error inesperado en streaming",
            });
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    }

    // Modo JSON (compatibilidad)
    const { reply, provider, azureError } = await qualyRespond(trimmed);
    return NextResponse.json({
      reply,
      provider,
      ...(azureError ? { azureError } : {}),
    });
  } catch (err) {
    console.error("[qualy] unexpected error", err);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado. Por favor intenta otra vez." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const mode = getQualyMode();
  return NextResponse.json({
    status: "ok",
    mode,
    streaming: true,
    message:
      mode === "azure"
        ? "Qualy está usando Azure OpenAI (POST con stream:true para SSE)."
        : "Qualy está en modo local (configura AZURE_OPENAI_* para activar Azure).",
  });
}
