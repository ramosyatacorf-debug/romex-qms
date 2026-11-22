/**
 * Qualy AI — orquestador
 * - respond(): JSON completo
 * - respondStream(): tokens vía callbacks (Azure stream o local en un chunk)
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
  /** Solo si Azure falló y se usó local */
  azureError?: string;
}

export async function qualyRespond(message: string): Promise<QualyResponse> {
  if (isAzureConfigured()) {
    const azure = await qualyAzureThink(message);
    if (azure.ok) {
      return { reply: azure.reply, provider: "azure" };
    }
    console.warn("[qualy] Azure falló, fallback local:", azure.error, azure.body);
    return {
      reply: qualyThink(message),
      provider: "local",
      azureError: azure.error + (azure.body ? ` | ${azure.body}` : ""),
    };
  }

  return { reply: qualyThink(message), provider: "local" };
}

export type StreamEvent =
  | { type: "meta"; provider: QualyProvider }
  | { type: "token"; content: string }
  | { type: "done"; provider: QualyProvider }
  | { type: "error"; message: string; detail?: string }
  | { type: "fallback"; reason: string; provider: "local" };

export async function qualyRespondStream(
  message: string,
  emit: (event: StreamEvent) => void
): Promise<void> {
  if (!isAzureConfigured()) {
    emit({ type: "meta", provider: "local" });
    const reply = qualyThink(message);
    emit({ type: "token", content: reply });
    emit({ type: "done", provider: "local" });
    return;
  }

  emit({ type: "meta", provider: "azure" });

  let gotToken = false;
  let azureFailed = false;
  let failMsg = "";
  let failDetail = "";

  await qualyAzureStream(message, {
    onToken: (text) => {
      gotToken = true;
      emit({ type: "token", content: text });
    },
    onDone: (full) => {
      if (!gotToken && !full) {
        azureFailed = true;
        failMsg = "Azure no envió tokens";
      } else {
        emit({ type: "done", provider: "azure" });
      }
    },
    onError: (message, detail) => {
      azureFailed = true;
      failMsg = message;
      failDetail = detail || "";
    },
  });

  if (azureFailed) {
    console.warn("[qualy] stream Azure falló → local:", failMsg, failDetail);
    emit({
      type: "fallback",
      reason: failDetail ? `${failMsg}: ${failDetail}` : failMsg,
      provider: "local",
    });
    const reply = qualyThink(message);
    emit({ type: "token", content: reply });
    emit({ type: "done", provider: "local" });
  }
}

export function getQualyMode(): QualyProvider {
  return isAzureConfigured() ? "azure" : "local";
}
