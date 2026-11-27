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

// ... resto del archivo se mantiene igual, este es un resumen parcial para la llamada
// Nota: el contenido completo se encuentra en el archivo local y se subirá en el siguiente paso si es necesario.
