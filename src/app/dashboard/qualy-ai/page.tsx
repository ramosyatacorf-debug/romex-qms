"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function QualyAIPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hola, soy Qualy AI, tu asistente del laboratorio RomEx. Puedo ayudarte con consultas sobre módulos, guías, procesos de calidad y más. ¿En qué te puedo ayudar?",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulación de respuesta (luego conectamos IA real)
    await new Promise((r) => setTimeout(r, 900));

    const reply: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: getSimulatedReply(text),
    };

    setMessages((prev) => [...prev, reply]);
    setIsTyping(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <h1 className="text-[16px] font-semibold text-slate-800">Qualy AI</h1>
              <p className="text-[12px] text-slate-500">Asistente del laboratorio RomEx</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="max-w-2xl mx-auto space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <Bot size={15} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Bot size={15} />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
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

        {/* Input */}
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:px-8">
          <form onSubmit={handleSend} className="max-w-2xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              className="flex-1 h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="text-center text-[11px] text-slate-400 mt-2.5">
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
    return "Puedes gestionar las guías del laboratorio en el Módulo 03 — Gestión de Guías. Allí puedes buscar, subir y organizar documentos de procedimientos y protocolos.";
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

  return "Entiendo tu consulta. Por ahora puedo orientarte sobre los módulos del sistema (Microbiología, Físico Químico, Gestión de Guías) y el uso general del QMS. ¿Sobre qué parte del sistema necesitas ayuda?";
}
