"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import QualyIcon from "@/components/QualyIcon";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

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

function getReply(userText: string): string {
  const t = userText.toLowerCase();
  if (t.includes("guía") || t.includes("guia"))
    return "Las guías están en el módulo tres, Gestión de Guías. Allí puedes buscar y subir documentos.";
  if (t.includes("micro") || t.includes("muestra"))
    return "El módulo de Microbiología está en desarrollo. Pronto podrás registrar muestras y resultados.";
  if (t.includes("físico") || t.includes("fisico") || t.includes("químico") || t.includes("quimico"))
    return "El módulo de Físico Químico formará parte del sistema de calidad RomEx.";
  if (t.includes("hola") || t.includes("buenos") || t.includes("buenas"))
    return "Hola. Soy Qualy AI, tu asistente del laboratorio RomEx. ¿En qué te ayudo?";
  if (t.includes("quién eres") || t.includes("quien eres") || t.includes("qué eres") || t.includes("que eres"))
    return "Soy Qualy AI, el asistente inteligente del sistema de gestión de calidad de RomEx.";
  if (t.includes("qué puedes") || t.includes("que puedes") || t.includes("ayuda"))
    return "Puedo orientarte sobre Microbiología, Físico Químico, Gestión de Guías y el uso del QMS.";
  return "Entendido. Puedo ayudarte con los módulos del laboratorio y el sistema QMS. ¿Qué necesitas?";
}

export default function QualyAIPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const statusRef = useRef<Status>("idle");

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const respond = useCallback(
    (text: string) => {
      const reply = getReply(text);
      setStatus("thinking");
      setTimeout(() => {
        if (voiceEnabled) {
          setStatus("speaking");
          speak(reply, () => setStatus("idle"));
        } else {
          setStatus("idle");
        }
      }, 700);
    },
    [voiceEnabled]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      if (voiceEnabled) {
        setStatus("speaking");
        speak(
          "Hola. Soy Qualy AI, asistente del laboratorio RomEx. Presiona el micrófono y habla conmigo.",
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

  const orbStyles: Record<Status, string> = {
    idle: "from-slate-100 via-slate-50 to-white border-slate-200 shadow-slate-200/80",
    listening: "from-blue-100 via-blue-50 to-white border-blue-300 shadow-blue-200/70 scale-110",
    thinking: "from-violet-100 via-purple-50 to-white border-violet-300 shadow-violet-200/70 animate-pulse",
    speaking: "from-teal-100 via-emerald-50 to-white border-teal-300 shadow-teal-200/70 scale-105",
  };

  const iconColor: Record<Status, string> = {
    idle: "text-slate-600",
    listening: "text-blue-600",
    thinking: "text-violet-600",
    speaking: "text-teal-600",
  };

  const ringColor: Record<Status, string> = {
    idle: "border-slate-200/60",
    listening: "border-blue-300/50",
    thinking: "border-violet-300/50",
    speaking: "border-teal-300/50",
  };

  const statusLabel: Record<Status, string> = {
    idle: "Toca el micrófono para hablar",
    listening: "Escuchando...",
    thinking: "Pensando...",
    speaking: "Hablando...",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <QualyIcon size={18} />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold text-slate-800">Qualy AI</h1>
              <p className="text-[11.5px] text-slate-500">Asistente del laboratorio RomEx</p>
            </div>
          </div>

          <button
            onClick={() => {
              setVoiceEnabled((v) => {
                if (v) window.speechSynthesis?.cancel();
                return !v;
              });
              if (status === "speaking") setStatus("idle");
            }}
            className={`p-2 rounded-lg transition-colors ${
              voiceEnabled
                ? "bg-blue-50 text-blue-600"
                : "bg-slate-100 text-slate-400"
            }`}
            title={voiceEnabled ? "Silenciar" : "Activar voz"}
          >
            {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

        {/* Centro */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative flex items-center justify-center">
            {(status === "listening" || status === "speaking") && (
              <>
                <div
                  className={`absolute w-52 h-52 rounded-full border ${ringColor[status]} animate-ping pointer-events-none`}
                  style={{ animationDuration: "2s" }}
                />
                <div
                  className={`absolute w-64 h-64 rounded-full border ${ringColor[status]} animate-ping pointer-events-none`}
                  style={{ animationDuration: "2.8s" }}
                />
              </>
            )}

            <button
              onClick={toggleMic}
              disabled={status === "thinking" || status === "speaking"}
              className={`relative w-44 h-44 rounded-full bg-gradient-to-br border-2 ${orbStyles[status]} shadow-xl transition-all duration-500 flex items-center justify-center disabled:cursor-default`}
            >
              <div className={`relative z-10 ${iconColor[status]}`}>
                {status === "listening" ? (
                  <Mic size={36} />
                ) : status === "speaking" ? (
                  <Volume2 size={36} />
                ) : status === "thinking" ? (
                  <div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                ) : (
                  <QualyIcon size={44} />
                )}
              </div>
            </button>
          </div>

          <p className="mt-10 text-[14px] text-slate-500 tracking-wide">
            {statusLabel[status]}
          </p>

          {transcript && status === "listening" && (
            <p className="mt-2 text-[13px] text-slate-400 max-w-xs text-center italic">
              “{transcript}”
            </p>
          )}

          <button
            onClick={toggleMic}
            disabled={status === "thinking" || status === "speaking"}
            className={`mt-8 flex items-center gap-2 h-11 px-6 rounded-full text-[13.5px] font-medium transition-all shadow-sm ${
              status === "listening"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
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

        <p className="shrink-0 text-center text-[11px] text-slate-400 pb-4">
          Qualy AI · RomEx QMS
        </p>
      </main>
    </div>
  );
}
