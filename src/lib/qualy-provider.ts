/**
 * Qualy AI — orquestador de proveedores
 * 1) Intenta Azure OpenAI si está configurado
 * 2) Si falla o no hay config → cerebro local (qualy-brain)
 */

import { qualyThink } from "@/lib/qualy-brain";
import { isAzureConfigured, qualyAzureThink } from "@/lib/qualy-azure";

export type QualyProvider = "azure" | "local";

export interface QualyResponse {
  reply: string;
  provider: QualyProvider;
}

export async function qualyRespond(message: string): Promise<QualyResponse> {
  if (isAzureConfigured()) {
    const azure = await qualyAzureThink(message);
    if (azure.ok) {
      return { reply: azure.reply, provider: "azure" };
    }
    // Fallback silencioso al cerebro local
    console.warn("[qualy] Azure no disponible, usando cerebro local:", azure.error);
  }

  return {
    reply: qualyThink(message),
    provider: "local",
  };
}

export function getQualyMode(): QualyProvider {
  return isAzureConfigured() ? "azure" : "local";
}
