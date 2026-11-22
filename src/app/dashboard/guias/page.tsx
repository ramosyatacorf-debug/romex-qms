"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { safeGetJSON, safeSetJSON } from "@/lib/safe-storage";
import Link from "next/link";
import {
  FolderOpen,
  Folder,
  Upload,
  Search,
  FileText,
  ChevronRight,
  X,
  Trash2,
  Eye,
  ArrowLeft,
  Package,
  Scale,
  Download,
  Home,
} from "lucide-react";

interface Guia {
  id: string;
  numeroGuia: string;
  zona: string;
  sacos: number;
  kilos: number;
  fechaRecepcion: string;
  anio: number;
  mes: number;
  fileName: string;
  fileData: string;
  createdAt: string;
}

type Vista = "inicio" | "carpetas" | "buscar" | "detalle";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const STORAGE_KEY = "romex_guias_remision";

function saveGuias(guias: Guia[]) {
  const res = safeSetJSON(STORAGE_KEY, guias);
  if (!res.ok) {
    alert(res.error || "No se pudo guardar. El PDF puede ser muy grande.");
    throw new Error("storage");
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Abre el PDF de forma segura usando Blob URL (evita document.write + data-URL largo). */
function openPdf(g: Guia) {
  try {
    const base64 = g.fileData.split(",")[1] || g.fileData;
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (win) {
      // Liberar el object URL después de un tiempo razonable
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } else {
      URL.revokeObjectURL(url);
      alert("No se pudo abrir el visor. Permite ventanas emergentes para este sitio.");
    }
  } catch {
    alert("No se pudo visualizar el PDF. El archivo puede estar dañado.");
  }
}

export default function GuiasPage() {
  const [guias, setGuias] = useState<Guia[]>([]);
  const [vista, setVista] = useState<Vista>("inicio");
  const [anioSel, setAnioSel] = useState<number | null>(null);
  const [mesSel, setMesSel] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Guia | null>(null);

  // Form upload
  const [numero, setNumero] = useState("");
  const [zona, setZona] = useState("");
  const [sacos, setSacos] = useState("");
  const [kilos, setKilos] = useState("");
  const [fecha, setFecha] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const data = safeGetJSON<Guia[]>(STORAGE_KEY, []);
    setGuias(Array.isArray(data) ? data : []);
  }, []);

  const anios = useMemo(() => {
    const set = new Set(guias.map((g) => g.anio));
    return Array.from(set).sort((a, b) => b - a);
  }, [guias]);

  const mesesEnAnio = useMemo(() => {
    if (anioSel == null) return [];
    const set = new Set(guias.filter((g) => g.anio === anioSel).map((g) => g.mes));
    return Array.from(set).sort((a, b) => a - b);
  }, [guias, anioSel]);

  const guiasFiltradas = useMemo(() => {
    let list = guias;
    if (vista === "carpetas" && anioSel != null) {
      list = list.filter((g) => g.anio === anioSel);
      if (mesSel != null) list = list.filter((g) => g.mes === mesSel);
    }
    if (vista === "buscar" && busqueda.trim()) {
      const q = busqueda.toLowerCase();
      list = list.filter(
        (g) =>
          g.numeroGuia.toLowerCase().includes(q) ||
          g.zona.toLowerCase().includes(q) ||
          g.fileName.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.fechaRecepcion.localeCompare(a.fechaRecepcion));
  }, [guias, vista, anioSel, mesSel, busqueda]);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!file || !numero.trim() || !fecha) return;
    setUploading(true);
    try {
      const data = await fileToBase64(file);
      const d = new Date(fecha);
      const nueva: Guia = {
        id: crypto.randomUUID(),
        numeroGuia: numero.trim(),
        zona: zona.trim() || "Sin zona",
        sacos: Number(sacos) || 0,
        kilos: Number(kilos) || 0,
        fechaRecepcion: fecha,
        anio: d.getFullYear(),
        mes: d.getMonth(),
        fileName: file.name,
        fileData: data,
        createdAt: new Date().toISOString(),
      };
      const next = [nueva, ...guias];
      saveGuias(next);
      setGuias(next);
      setShowUpload(false);
      setNumero(""); setZona(""); setSacos(""); setKilos(""); setFecha(""); setFile(null);
    } catch {
      /* alert already shown in saveGuias */
    } finally {
      setUploading(false);
    }
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta guía de remisión?")) return;
    const next = guias.filter((g) => g.id !== id);
    saveGuias(next);
    setGuias(next);
    if (selected?.id === id) setSelected(null);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--md-surface)" }}>
      <header
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b"
        style={{
          background: "var(--md-surface-container-low)",
          borderColor: "color-mix(in srgb, var(--md-outline-variant) 50%, transparent)",
        }}
      >
        <Link href="/dashboard" className="p-2 rounded-full hover:bg-[var(--md-surface-container)]">
          <ArrowLeft size={18} />
        </Link>
        <FolderOpen size={20} className="text-[var(--md-primary)]" />
        <h1 className="text-[18px] font-medium" style={{ color: "var(--md-on-surface)" }}>
          Gestión de Guías de Remisión
        </h1>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="md-btn-filled !h-9 !px-4 text-[13px]"
          >
            <Upload size={15} /> Subir PDF
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => { setVista("inicio"); setAnioSel(null); setMesSel(null); }}
            className={`px-4 py-2 text-[13px] rounded-full border ${vista === "inicio" ? "bg-[var(--md-secondary-container)] border-transparent" : "border-[var(--md-outline-variant)]"}`}
          >
            <Home size={14} className="inline mr-1" /> Inicio
          </button>
          <button
            type="button"
            onClick={() => setVista("carpetas")}
            className={`px-4 py-2 text-[13px] rounded-full border ${vista === "carpetas" ? "bg-[var(--md-secondary-container)] border-transparent" : "border-[var(--md-outline-variant)]"}`}
          >
            <Folder size={14} className="inline mr-1" /> Carpetas
          </button>
          <button
            type="button"
            onClick={() => setVista("buscar")}
            className={`px-4 py-2 text-[13px] rounded-full border ${vista === "buscar" ? "bg-[var(--md-secondary-container)] border-transparent" : "border-[var(--md-outline-variant)]"}`}
          >
            <Search size={14} className="inline mr-1" /> Buscar
          </button>
        </div>

        {vista === "buscar" && (
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--md-on-surface-variant)]" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por número, zona o archivo..."
              className="md-field md-field-with-leading w-full"
            />
          </div>
        )}

        {vista === "carpetas" && (
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            {anioSel == null ? (
              anios.length === 0 ? (
                <p className="text-[14px]" style={{ color: "var(--md-on-surface-variant)" }}>No hay años aún.</p>
              ) : (
                anios.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAnioSel(a)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl border bg-white hover:shadow-sm"
                    style={{ borderColor: "var(--md-outline-variant)" }}
                  >
                    <Folder size={18} className="text-[var(--md-primary)]" />
                    <span className="font-medium">{a}</span>
                    <ChevronRight size={14} />
                  </button>
                ))
              )
            ) : mesSel == null ? (
              <>
                <button type="button" onClick={() => setAnioSel(null)} className="text-[13px] underline">
                  ← Años
                </button>
                {mesesEnAnio.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMesSel(m)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl border bg-white hover:shadow-sm"
                    style={{ borderColor: "var(--md-outline-variant)" }}
                  >
                    <Folder size={18} />
                    <span>{MESES[m]}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </>
            ) : (
              <button type="button" onClick={() => setMesSel(null)} className="text-[13px] underline">
                ← {anioSel} / Meses
              </button>
            )}
          </div>
        )}

        {(vista !== "carpetas" || (anioSel != null && mesSel != null) || vista === "buscar") && (
          <div className="space-y-2">
            {guiasFiltradas.length === 0 ? (
              <p className="text-[14px] py-8 text-center" style={{ color: "var(--md-on-surface-variant)" }}>
                {vista === "inicio" ? "No hay guías registradas. Sube la primera." : "Sin resultados."}
              </p>
            ) : (
              guiasFiltradas.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border bg-white"
                  style={{ borderColor: "color-mix(in srgb, var(--md-outline-variant) 60%, transparent)" }}
                >
                  <FileText size={20} className="shrink-0 text-[var(--md-primary)]" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate" style={{ color: "var(--md-on-surface)" }}>
                      {g.numeroGuia} · {g.zona}
                    </p>
                    <p className="text-[12px]" style={{ color: "var(--md-on-surface-variant)" }}>
                      {g.fechaRecepcion} · {g.sacos} sacos · {g.kilos} kg · {g.fileName}
                    </p>
                  </div>
                  <button type="button" onClick={() => openPdf(g)} title="Ver PDF" className="p-2 rounded-full hover:bg-[var(--md-surface-container)]">
                    <Eye size={16} />
                  </button>
                  <button type="button" onClick={() => handleDelete(g.id)} title="Eliminar" className="p-2 rounded-full hover:bg-red-50 text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {vista === "inicio" && guias.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Total guías" value={guias.length} icon={<FileText size={16} />} />
            <Stat label="Años" value={anios.length} icon={<Folder size={16} />} />
            <Stat label="Sacos" value={guias.reduce((s, g) => s + (g.sacos || 0), 0)} icon={<Package size={16} />} />
            <Stat label="Kilos" value={guias.reduce((s, g) => s + (g.kilos || 0), 0)} icon={<Scale size={16} />} />
          </div>
        )}
      </main>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-medium">Subir guía de remisión</h2>
              <button type="button" onClick={() => setShowUpload(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-3">
              <input required value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número de guía" className="md-field w-full" />
              <input value={zona} onChange={(e) => setZona(e.target.value)} placeholder="Zona" className="md-field w-full" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={sacos} onChange={(e) => setSacos(e.target.value)} placeholder="Sacos" className="md-field w-full" />
                <input type="number" value={kilos} onChange={(e) => setKilos(e.target.value)} placeholder="Kilos" className="md-field w-full" />
              </div>
              <input required type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="md-field w-full" />
              <input required type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-[13px]" />
              <button type="submit" disabled={uploading} className="md-btn-filled w-full">
                {uploading ? "Guardando..." : "Guardar guía"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="p-4 rounded-2xl border bg-white flex items-center gap-3" style={{ borderColor: "var(--md-outline-variant)" }}>
      <div className="text-[var(--md-primary)]">{icon}</div>
      <div>
        <p className="text-[20px] font-semibold">{value.toLocaleString()}</p>
        <p className="text-[12px]" style={{ color: "var(--md-on-surface-variant)" }}>{label}</p>
      </div>
    </div>
  );
}
