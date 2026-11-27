"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { FormEvent } from "react";
import Sidebar from "@/components/Sidebar";
import QualyNucleus from "@/components/QualyNucleus";
import QualyIcon from "@/components/QualyIcon";
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles } from "lucide-react";

type Status = "idle" | "listening" | "thinking" | "speaking";

function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";
  u.rate = 1;
  u.pitch = 1.05;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  window.speechSynthesis.speak(u);
}

async function askQualyStream(
  message: string,
  onPartial: (text: string) => void
): Promise<{ reply: string; provider: string; error?: string }> {
  const res = await fetch("/api/qualy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, stream: true }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return {
      reply: data.error || `Error del servidor (${res.status}).`,
      provider: "error",
      error: data.error,
    };
  }

  if (!res.body) {
    return { reply: "Sin cuerpo de respuesta.", provider: "error", error: "empty body" };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  let provider = "azure";
  let streamError: string | undefined;

  const processChunk = (chunk: string) => {
    const line = chunk.trim();
    if (!line.startsWith("data:")) return;
    const payload = line.slice(5).trim();
    try {
      const ev = JSON.parse(payload) as {
        type: string;
        content?: string;
        provider?: string;
        message?: string;
        reason?: string;
      };
      if (ev.type === "meta" && ev.provider) provider = ev.provider;
      if (ev.type === "token" && ev.content) {
        full += ev.content;
        onPartial(full);
      }
      if (ev.type === "fallback") {
        if (ev.provider) provider = ev.provider;
        streamError = ev.reason;
      }
      if (ev.type === "done" && ev.provider) provider = ev.provider;
      if (ev.type === "error") {
        streamError = ev.message;
      }
    } catch {
      // ignore malformed event
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";
    for (const chunk of chunks) processChunk(chunk);
  }

  // Flush remaining buffer (último evento puede no terminar en \n\n)
  buffer += decoder.decode();
  if (buffer.trim()) {
    for (const chunk of buffer.split("\n\n")) {
      if (chunk.trim()) processChunk(chunk);
    }
  }

  return {
    reply: full || streamError || "No pude responder.",
    provider,
    error: streamError,
  };
}

const STATUS_META: Record<
  Status,
  { label: string; chip: string; dot: string }
> = {
  idle: {
    label: "Listo para ayudarte",
    chip: "bg-[var(--md-surface-container-high)] text-[var(--md-on-surface-variant)]",
    dot: "bg-[var(--md-outline)]",
  },
  listening: {
    label: "Escuchando…",
    chip: "bg-red-50 text-red-700 border border-red-100",
    dot: "bg-red-500 animate-pulse",
  },
  thinking: {
    label: "Pensando…",
    chip: "bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)]",
    dot: "bg-[var(--md-primary)] animate-pulse",
  },
  speaking: {
    label: "Hablando…",
    chip: "bg-emerald-50 text-emerald-800 border border-emerald-100",
    dot: "bg-emerald-500 animate-pulse",
  },
};

export default function QualyAIPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [streamText, setStreamText] = useState("");
  const [lastUserMsg, setLastUserMsg] = useState("");
  const [providerLabel, setProviderLabel] = useState("");
  const recognitionRef = useRef<any>(null);
  const statusRef = useRef<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const respond = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setLastUserMsg(trimmed);
      setStatus("thinking");
      setStreamText("");
      setProviderLabel("");

      try {
        const { reply, provider, error } = await askQualyStream(trimmed, (partial) => {
          setStreamText(partial);
          if (partial) setStatus("thinking");
        });

        setStreamText(reply);
        setProviderLabel(
          provider === "azure"
            ? "Azure OpenAI"
            : provider === "local"
              ? error
                ? `Local · ${error.slice(0, 60)}`
                : "Local"
              : provider
        );

        if (voiceEnabled && reply) {
          setStatus("speaking");
          speak(reply, () => setStatus("idle"));
        } else {
          setStatus("idle");
        }
      } catch {
        setStreamText("Hubo un problema de conexión. Inténtalo de nuevo.");
        setProviderLabel("error");
        setStatus("idle");
      }
    },
    [voiceEnabled]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      if (voiceEnabled) {
        setStatus("speaking");
        speak(
          "Hola. Soy Qualy AI, asistente del laboratorio RomEx. Presiona el micrófono o escribe tu consulta.",
          () => setStatus("idle")
        );
      }
    }, 800);
    return () => {
      clearTimeout(t);
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = () => {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SR) {
      setStatus("listening");
      setTranscript("Escuchando...");
      setTimeout(() => {
        setTranscript("");
        respond("hola");
      }, 1600);
      return;
    }

    const recognition = new SR();
    recognition.lang = "es-ES";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setStatus("listening");
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setTranscript(finalText || interim);
      if (finalText) {
        recognition.stop();
        setTranscript("");
        respond(finalText);
      }
    };

    recognition.onerror = () => {
      setStatus("idle");
      setTranscript("");
    };

    recognition.onend = () => {
      if (statusRef.current === "listening") {
        setStatus("idle");
        setTranscript("");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop?.();
    setStatus("idle");
    setTranscript("");
  };

  const toggleMic = () => {
    if (status === "listening") stopListening();
    else if (status === "idle") startListening();
  };

  const handleTextSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (status === "thinking" || status === "speaking") return;
    const msg = textInput.trim();
    if (!msg) return;
    setTextInput("");
    respond(msg);
  };

  const busy = status === "thinking" || status === "speaking";
  const meta = STATUS_META[status];
  const thinkingLabel = streamText ? "Respondiendo…" : meta.label;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--md-surface)" }}
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header
          className="shrink-0 flex items-center justify-between gap-4 px-5 sm:px-7 h-[64px]"
          style={{
            background: "var(--md-surface-container-lowest)",
            borderBottom:
              "1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 flex items-center justify-center shrink-0"
              style={{
                borderRadius: "var(--md-radius-md)",
                background: "var(--md-primary-container)",
                color: "var(--md-on-primary-container)",
              }}
            >
              <QualyIcon size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  className="text-[15px] font-semibold tracking-tight truncate"
                  style={{ color: "var(--md-on-surface)" }}
                >
                  Qualy AI
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${meta.chip}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  {status === "thinking" ? thinkingLabel : meta.label}
                </span>
              </div>
              <p
                className="text-[12px] truncate mt-0.5"
                style={{ color: "var(--md-on-surface-variant)" }}
              >
                Asistente del laboratorio · RomEx QMS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setVoiceEnabled((v) => {
                if (v) window.speechSynthesis?.cancel();
                return !v;
              });
              if (status === "speaking") setStatus("idle");
            }}
            className="p-2.5 transition-colors shrink-0"
            style={{
              borderRadius: "var(--md-radius-full)",
              background: voiceEnabled
                ? "var(--md-primary-container)"
                : "var(--md-surface-container-high)",
              color: voiceEnabled
                ? "var(--md-on-primary-container)"
                : "var(--md-on-surface-variant)",
            }}
            title={voiceEnabled ? "Silenciar voz" : "Activar voz"}
          >
            {voiceEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        </header>

        {/* Stage */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            <div className="max-w-2xl mx-auto flex flex-col items-center">
              {/* Núcleo */}
              <button
                type="button"
                onClick={toggleMic}
                disabled={busy}
                className="disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-primary)]/30 rounded-full transition-transform active:scale-[0.98]"
                title={status === "listening" ? "Detener" : "Hablar"}
              >
                <QualyNucleus
                  size={240}
                  speaking={status === "speaking"}
                  listening={status === "listening"}
                  thinking={status === "thinking"}
                />
              </button>

              <p
                className="mt-3 text-[13px] text-center"
                style={{ color: "var(--md-on-surface-variant)" }}
              >
                {status === "idle" && "Toca el núcleo o usa el micrófono"}
                {status === "listening" && "Habla ahora…"}
                {status === "thinking" && (streamText ? "Escribiendo respuesta…" : "Procesando tu consulta…")}
                {status === "speaking" && "Reproduciendo respuesta…"}
              </p>

              {/* Transcript en vivo */}
              {transcript && status === "listening" && (
                <div
                  className="mt-4 w-full max-w-md px-4 py-3 text-center text-[13.5px] italic"
                  style={{
                    color: "var(--md-on-surface-variant)",
                    background: "var(--md-surface-container-low)",
                    borderRadius: "var(--md-radius-lg)",
                    border:
                      "1px solid color-mix(in srgb, var(--md-outline-variant) 50%, transparent)",
                  }}
                >
                  “{transcript}”
                </div>
              )}

              {/* Conversación */}
              {(lastUserMsg || streamText) && (
                <div className="mt-8 w-full space-y-3">
                  {lastUserMsg && (
                    <div className="flex justify-end">
                      <div
                        className="max-w-[85%] px-4 py-2.5 text-[13.5px] leading-relaxed"
                        style={{
                          background: "var(--md-secondary-container)",
                          color: "var(--md-on-secondary-container)",
                          borderRadius: "18px 18px 6px 18px",
                        }}
                      >
                        {lastUserMsg}
                      </div>
                    </div>
                  )}

                  {streamText && (
                    <div className="flex justify-start gap-2.5">
                      <div
                        className="w-8 h-8 shrink-0 flex items-center justify-center mt-0.5"
                        style={{
                          borderRadius: "var(--md-radius-full)",
                          background: "var(--md-primary-container)",
                          color: "var(--md-on-primary-container)",
                        }}
                      >
                        <Sparkles size={14} />
                      </div>
                      <div
                        className="max-w-[90%] px-4 py-3 text-[13.5px] leading-relaxed whitespace-pre-wrap"
                        style={{
                          background: "var(--md-surface-container-lowest)",
                          color: "var(--md-on-surface)",
                          borderRadius: "6px 18px 18px 18px",
                          border:
                            "1px solid color-mix(in srgb, var(--md-outline-variant) 45%, transparent)",
                          boxShadow: "var(--md-elevation-1)",
                        }}
                      >
                        {streamText}
                        {status === "thinking" && streamText && (
                          <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-[var(--md-primary)]/70 animate-pulse rounded-sm" />
                        )}
                      </div>
                    </div>
                  )}

                  {providerLabel && status !== "thinking" && (
                    <p
                      className="text-[11px] pl-10"
                      style={{ color: "var(--md-on-surface-variant)" }}
                    >
                      Fuente: {providerLabel}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Composer fijo */}
          <div
            className="shrink-0 px-4 sm:px-6 pt-3 pb-5"
            style={{
              background:
                "linear-gradient(to top, var(--md-surface) 70%, transparent)",
            }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={toggleMic}
                  disabled={busy}
                  className="inline-flex items-center gap-2 h-10 px-5 text-[13px] font-medium transition-all disabled:opacity-45 disabled:cursor-not-allowed"
                  style={{
                    borderRadius: "var(--md-radius-full)",
                    background:
                      status === "listening"
                        ? "var(--md-error)"
                        : "var(--md-primary)",
                    color: "var(--md-on-primary)",
                    boxShadow: "var(--md-elevation-1)",
                  }}
                >
                  {status === "listening" ? (
                    <>
                      <MicOff size={15} />
                      Detener
                    </>
                  ) : (
                    <>
                      <Mic size={15} />
                      Hablar
                    </>
                  )}
                </button>
              </div>

              <form onSubmit={handleTextSubmit} className="relative">
                <div
                  className="flex items-center gap-2 pl-4 pr-2 py-1.5"
                  style={{
                    background: "var(--md-surface-container-lowest)",
                    borderRadius: "var(--md-radius-full)",
                    border:
                      "1px solid color-mix(in srgb, var(--md-outline-variant) 60%, transparent)",
                    boxShadow: "var(--md-elevation-1)",
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Escribe tu consulta a Qualy…"
                    disabled={busy}
                    className="flex-1 h-10 bg-transparent text-[14px] outline-none disabled:opacity-50 min-w-0"
                    style={{ color: "var(--md-on-surface)" }}
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim() || busy}
                    className="h-9 w-9 shrink-0 flex items-center justify-center transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                    style={{
                      borderRadius: "var(--md-radius-full)",
                      background: textInput.trim()
                        ? "var(--md-primary)"
                        : "var(--md-surface-container-high)",
                      color: textInput.trim()
                        ? "var(--md-on-primary)"
                        : "var(--md-on-surface-variant)",
                    }}
                    title="Enviar"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </form>

              <p
                className="text-center text-[11px] mt-3"
                style={{ color: "var(--md-on-surface-variant)" }}
              >
                Qualy AI · Exportadora RomEx S.A.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
