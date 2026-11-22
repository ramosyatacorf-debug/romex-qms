/**
 * Qualy AI — orquestador
 * Orden: Azure stream → Azure JSON → local (solo si Azure no responde)
 * Nunca oculta el error de Azure al usuario.
 */

import { qualyThink } from "@/lib/qualy-brain";
import {
  isAzureConfigured,
  qualyAzureThink,
  qualyAzureStream,
} from "@/lib/qualy-azure";

export type QualyProvider = "azure" | "local";

export interface QualyResponse {
  reply: string;
  provider: QualyProvider;
  azureError?: string;
}

export async function qualyRespond(message: string): Promise<QualyResponse> {
  if (isAzureConfigured()) {
    const azure = await qualyAzureThink(message);
    if (azure.ok) {
      return { reply: azure.reply, provider: "azure" };
    }
    const err =
      azure.error + (azure.status ? ` (HTTP ${azure.status})` : "") +
      (azure.body ? ` — ${azure.body.slice(0, 200)}` : "");
    console.warn("[qualy] Azure JSON falló:", err);
    return {
      reply: `No pude usar Azure OpenAI: ${azure.error}. Revisa deployment, clave y cuota (Students suele limitar TPM). Detalle en consola del servidor.`,
      provider: "local",
      azureError: err,
    };
  }

  return { reply: qualyThink(message), provider: "local" };
}

export type StreamEvent =
  | { type: "meta"; provider: QualyProvider }
  | { type: "token"; content: string }
  | { type: "done"; provider: QualyProvider }
  | { type: "error"; message: string; detail?: string }
  | { type: "fallback"; reason: string; provider: QualyProvider };

export async function qualyRespondStream(
  message: string,
  emit: (event: StreamEvent) => void
): Promise<void> {
  if (!isAzureConfigured()) {
    emit({ type: "meta", provider: "local" });
    emit({ type: "token", content: qualyThink(message) });
    emit({ type: "done", provider: "local" });
    return;
  }

  emit({ type: "meta", provider: "azure" });

  let gotToken = false;
  let streamFailed = false;
  let failMsg = "";
  let failDetail = "";

  await qualyAzureStream(message, {
    onToken: (text) => {
      gotToken = true;
      emit({ type: "token", content: text });
    },
    onDone: (full) => {
      if (!gotToken && !full.trim()) {
        streamFailed = true;
        failMsg = "Azure stream no envió contenido";
      } else {
        emit({ type: "done", provider: "azure" });
      }
    },
    onError: (msg, detail) => {
      streamFailed = true;
      failMsg = msg;
      failDetail = detail || "";
    },
  });

  if (!streamFailed) return;

  // 2º intento: Azure sin streaming (más compatible con cuotas Students)
  console.warn("[qualy] stream falló, reintento JSON:", failMsg, failDetail);
  const azure = await qualyAzureThink(message);
  if (azure.ok) {
    emit({
      type: "fallback",
      reason: `Stream falló (${failMsg}); respuesta por JSON.`,
      provider: "azure",
    });
    emit({ type: "token", content: azure.reply });
    emit({ type: "done", provider: "azure" });
    return;
  }

  const reason =
    failDetail ||
    azure.body ||
    azure.error ||
    failMsg ||
    "Error desconocido de Azure";

  console.error("[qualy] Azure total fail:", reason);
  emit({ type: "fallback", reason, provider: "local" });
  emit({
    type: "token",
    content:
      `Azure OpenAI no respondió: ${azure.error || failMsg}. ` +
      `Si usas Azure for Students, la cuota (TPM) puede estar agotada o el deployment mal nombrado. ` +
      `Revisa la terminal del servidor (npm run dev) para el detalle HTTP.`,
  });
  emit({ type: "done", provider: "local" });
}

export function getQualyMode(): QualyProvider {
  return isAzureConfigured() ? "azure" : "local";
}
