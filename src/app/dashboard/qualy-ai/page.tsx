"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import QualyNucleus from "@/components/QualyNucleus";
import QualyIcon from "@/components/QualyIcon";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  ArrowLeft,
  Home,
} from "lucide-react";

type Status = "idle" | "listening" | "thinking" | "speaking";

interface ChatMsg {
  id: string;
  role: "user" | "qualy";
  text: string;
  time: string;
}

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

async function askQualy(message: string): Promise<string> {
  try {
    const res = await fetch("/api/qualy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data.reply || "No pude responder en este momento.";
  } catch {
    return "Hubo un problema de conexión. Inténtalo de nuevo.";
  }
}

function nowTime() {
  return new Date().toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function QualyAIPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const recognitionRef = useRef<any>(null);
  const statusRef = useRef<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const pushMsg = (role: "user" | "qualy", text: string) => {
    setMessages((prev) => [
      ...prev.slice(-20),
      { id: `${Date.now()}-${Math.random()}`, role, text, time: nowTime() },
    ]);
  };

  const respond = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean) return;
      pushMsg("user", clean);
      setStatus("thinking");
      const reply = await askQualy(clean);
      pushMsg("qualy", reply);
      if (voiceEnabled) {
        setStatus("speaking");
        speak(reply, () => setStatus("idle"));
      } else {
        setStatus("idle");
      }
    },
    [voiceEnabled]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      const hello =
        "Hola. Soy Qualy AI, asistente del laboratorio RomEx. Diga mi nombre o escriba cuando me necesite.";
      pushMsg("qualy", hello);
      if (voiceEnabled) {
        setStatus("speaking");
        speak(hello, () => setStatus("idle"));
      }
    }, 700);
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
      setTranscript("Micrófono no disponible en este navegador");
      setTimeout(() => {
        setTranscript("");
        setStatus("idle");
      }, 2000);
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

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || status === "thinking" || status === "speaking") return;
    setInput("");
    respond(text);
  };

  const statusLabel: Record<Status, string> = {
    idle: "En espera · diga mi nombre cuando me necesite",
    listening: "Escuchando...",
    thinking: "Procesando...",
    speaking: "Respondiendo...",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1220] text-slate-100">
      <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-white/5 bg-[#0e1628]">
        <div className="px-4 pt-5 pb-4 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-400/20 flex items-center justify-center text-blue-300">
            <QualyIcon size={18} />
          </div>
          <div>
            <p className="text-[14px] font-semibold tracking-tight">Qualy AI</p>
            <p className="text-[10px] text-slate-500">Asistente RomEx</p>
          </div>
        </div>

        <nav className="flex-1 px-2.5 space-y-0.5">
          <Link
            href="/dashboard/qualy-ai"
            className="flex items-center gap-2.5 h-10 px-3 rounded-xl text-[13px] font-medium bg-blue-500/15 text-blue-200"
          >
            <Home size={16} />
            Inicio
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 h-10 px-3 rounded-xl text-[13px] font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200"
          >
            <ArrowLeft size={16} />
            Portal QMS
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-white/5">
          <p className="text-[11px] text-slate-500">Usuario</p>
          <p className="text-[13px] font-medium text-slate-300">Fabricio</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="shrink-0 h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/5 bg-[#0b1220]/80 backdrop-blur">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-200">Qualy · Asistente</p>
            <p className="text-[11px] text-slate-500 truncate">{statusLabel[status]}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setVoiceEnabled((v) => {
                  if (v) window.speechSynthesis?.cancel();
                  return !v;
                });
                if (status === "speaking") setStatus("idle");
              }}
              className={`p-2 rounded-lg transition-colors ${
                voiceEnabled
                  ? "bg-blue-500/15 text-blue-300"
                  : "bg-white/5 text-slate-500"
              }`}
              title={voiceEnabled ? "Silenciar" : "Activar voz"}
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <Link
              href="/dashboard"
              className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5"
            >
              <ArrowLeft size={16} />
            </Link>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(37,99,235,0.18), transparent 70%)",
            }}
          />

          <h1 className="relative z-10 text-[28px] sm:text-[32px] font-semibold tracking-tight text-white mb-1">
            Qualy
          </h1>
          <p className="relative z-10 text-[13px] text-slate-400 mb-6 text-center max-w-sm">
            {statusLabel[status]}
          </p>

          <button
            type="button"
            onClick={toggleMic}
            disabled={status === "thinking" || status === "speaking"}
            className="relative z-10 disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 rounded-full"
            title={status === "listening" ? "Detener" : "Hablar"}
          >
            <QualyNucleus
              size={300}
              speaking={status === "speaking"}
              listening={status === "listening"}
              thinking={status === "thinking"}
            />
          </button>

          {transcript && status === "listening" && (
            <p className="relative z-10 mt-4 text-[13px] text-blue-200/80 max-w-md text-center italic">
              “{transcript}”
            </p>
          )}

          {messages.length > 0 && status !== "listening" && (
            <div className="relative z-10 mt-6 max-w-md w-full">
              {(() => {
                const last = messages[messages.length - 1];
                return (
                  <div
                    className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed border ${
                      last.role === "qualy"
                        ? "bg-white/5 border-white/10 text-slate-200"
                        : "bg-blue-500/15 border-blue-400/20 text-blue-100"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      {last.role === "qualy" ? "Qualy" : "Tú"} · {last.time}
                    </p>
                    <p className="line-clamp-4">{last.text}</p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="shrink-0 px-4 sm:px-6 pb-5 pt-2">
          <form
            onSubmit={handleSend}
            className="max-w-xl mx-auto flex items-center gap-2 rounded-full border border-white/10 bg-[#121a2e] px-2 py-1.5 shadow-lg shadow-black/20"
          >
            <button
              type="button"
              onClick={toggleMic}
              disabled={status === "thinking" || status === "speaking"}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                status === "listening"
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              } disabled:opacity-40`}
              title={status === "listening" ? "Detener" : "Hablar"}
            >
              {status === "listening" ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escriba o diga mi nombre..."
              disabled={status === "thinking" || status === "speaking"}
              className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[14px] text-slate-100 placeholder:text-slate-500 h-10 px-1 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || status === "thinking" || status === "speaking"}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-600 mt-2">
            Qualy AI · RomEx QMS · Núcleo interactivo
          </p>
        </div>
      </main>
    </div>
  );
}
