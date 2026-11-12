/** Lectura/escritura segura de localStorage con manejo de cuota y JSON inválido */

export function safeGetJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeSetJSON(key: string, value: unknown): { ok: boolean; error?: string } {
  if (typeof window === "undefined") return { ok: false, error: "ssr" };
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (e) {
    const msg =
      e instanceof DOMException && e.name === "QuotaExceededError"
        ? "Almacenamiento lleno. Elimina registros antiguos o usa archivos más livianos."
        : "No se pudo guardar en este dispositivo.";
    return { ok: false, error: msg };
  }
}

export function safeRemove(key: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
