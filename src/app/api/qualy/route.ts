import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Eres Qualy AI, el asistente inteligente del laboratorio de Exportadora RomEx S.A. y del sistema QMS (Quality Management System).

Tu personalidad:
- Profesional, claro y amable
- Respondes en español
- Respuestas concisas (2 a 4 oraciones), pensadas para ser leídas en voz alta
- Puedes ayudar con el sistema RomEx QMS (módulos Microbiología, Físico Químico, Gestión de Guías) y también con CUALQUIER otra pregunta general: ciencia, calidad, laboratorio, tecnología, matemáticas, etc.

Contexto del sistema:
- Módulo 01: Microbiología
- Módulo 02: Físico Químico
- Módulo 03: Gestión de Guías (almacenamiento de procedimientos y protocolos)
- Qualy AI es el asistente de voz del laboratorio

Si no sabes algo con certeza, dilo con honestidad. No inventes datos de laboratorio específicos de RomEx que no conozcas.`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    const apiKey = process.env.XAI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply:
          "Aún no estoy conectado a una inteligencia completa. Configura la clave XAI_API_KEY en el archivo .env.local para activarme al máximo.",
      });
    }

    const isXai = !!process.env.XAI_API_KEY;
    const baseUrl = isXai ? "https://api.x.ai/v1" : "https://api.openai.com/v1";
    const model = isXai ? "grok-2-latest" : "gpt-4o-mini";

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI API error:", errText);
      return NextResponse.json({
        reply:
          "Tuve un problema al procesar tu consulta. Inténtalo de nuevo en un momento.",
      });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "No pude generar una respuesta. Inténtalo de nuevo.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Qualy API error:", error);
    return NextResponse.json({
      reply: "Ocurrió un error inesperado. Por favor intenta otra vez.",
    });
  }
}
