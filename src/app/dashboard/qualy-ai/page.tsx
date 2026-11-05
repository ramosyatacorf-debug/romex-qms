"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import QualyIcon from "@/components/QualyIcon";
import { Send, User, Volume2, VolumeX } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export default function QualyAIPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hola, soy Qualy AI, tu asistente del laboratorio RomEx. Puedo ayudarte con consultas sobre módulos, guías, procesos de calidad y más. ¿En qué te puedo ayudar?",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Saludo con voz al entrar (una sola vez)
  useEffect(() => {
    if (voiceEnabled) {
      const t = setTimeout(() => {
        speak(messages[0].content);
      }, 600);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800));

    const replyText = getSimulatedReply(text);
    const reply: Message = { id: Date.now() + 1, role: "assistant", content: replyText };
    setMessages((prev) => [...prev, reply]);
    setIsTyping(false);

    if (voiceEnabled) speak(replyText);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header fijo */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <QualyIcon size={20} />
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
              }}
              className={`p-2 rounded-lg transition-colors ${
                voiceEnabled
                  ? "bg-blue-50 text-blue-600"
                  : "bg-slate-100 text-slate-400"
              }`}
              title={voiceEnabled ? "Silenciar voz" : "Activar voz"}
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>

        {/* Mensajes - solo esta zona hace scroll */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 md:px-8"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <QualyIcon size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                    <User size={13} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0">
                  <QualyIcon size={14} />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-3.5 py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input fijo abajo */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 md:px-8">
          <form onSubmit={handleSend} className="max-w-2xl mx-auto flex gap-2.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              className="flex-1 h-10 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
          <p className="text-center text-[10.5px] text-slate-400 mt-2">
            Qualy AI puede cometer errores. Verifica la información importante.
          </p>
        </div>
      </main>
    </div>
  );
}

function getSimulatedReply(userText: string): string {
  const t = userText.toLowerCase();

  if (t.includes("guía") || t.includes("guia")) {
    return "Puedes gestionar las guías del laboratorio en el Módulo 03, Gestión de Guías. Allí puedes buscar, subir y organizar documentos de procedimientos y protocolos.";
  }
  if (t.includes("micro") || t.includes("muestra")) {
    return "El módulo de Microbiología está en desarrollo. Pronto podrás registrar muestras, cargar resultados y generar reportes desde allí.";
  }
  if (t.includes("físico") || t.includes("fisico") || t.includes("químico") || t.includes("quimico")) {
    return "El módulo de Físico Químico formará parte del QMS. Estará disponible junto con las demás secciones del laboratorio.";
  }
  if (t.includes("hola") || t.includes("buenos") || t.includes("buenas")) {
    return "¡Hola! Estoy listo para ayudarte con el sistema RomEx QMS. Puedes preguntarme sobre módulos, guías o procesos del laboratorio.";
  }
  if (t.includes("qué puedes") || t.includes("que puedes") || t.includes("qué sabes") || t.includes("que sabes")) {
    return "Puedo orientarte sobre los módulos del sistema: Microbiología, Físico Químico y Gestión de Guías. También sobre el uso general del QMS de RomEx. ¿Qué necesitas saber?";
  }

  return "Entiendo tu consulta. Por ahora puedo orientarte sobre los módulos del sistema y el uso general del QMS. ¿Sobre qué parte del sistema necesitas ayuda?";
}
