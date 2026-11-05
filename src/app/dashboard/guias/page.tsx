"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
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

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const STORAGE_KEY = "romex_guias_remision";

function loadGuias(): Guia[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Guia[]) : [];
  } catch {
    return [];
  }
}

function saveGuias(guias: Guia[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guias));
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function GuiasPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [guias, setGuias] = useState<Guia[]>([]);
  const [search, setSearch] = useState("");
  const [selectedAnio, setSelectedAnio] = useState<number | null>(null);
  const [selectedMes, setSelectedMes] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [preview, setPreview] = useState<Guia | null>(null);

  const [numeroGuia, setNumeroGuia] = useState("");
  const [zona, setZona] = useState("");
  const [sacos, setSacos] = useState("");
  const [kilos, setKilos] = useState("");
  const [fechaRecepcion, setFechaRecepcion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setGuias(loadGuias());
  }, []);

  const anios = useMemo(() => {
    const map = new Map<number, number>();
    guias.forEach((g) => map.set(g.anio, (map.get(g.anio) || 0) + 1));
    return Array.from(map.entries())
      .map(([anio, count]) => ({ anio, count }))
      .sort((a, b) => b.anio - a.anio);
  }, [guias]);

  const mesesDelAnio = useMemo(() => {
    if (!selectedAnio) return [];
    const map = new Map<number, number>();
    guias
      .filter((g) => g.anio === selectedAnio)
      .forEach((g) => map.set(g.mes, (map.get(g.mes) || 0) + 1));
    return Array.from(map.entries())
      .map(([mes, count]) => ({ mes, count }))
      .sort((a, b) => b.mes - a.mes);
  }, [guias, selectedAnio]);

  const guiasDelMes = useMemo(() => {
    if (!selectedAnio || !selectedMes) return [];
    let list = guias.filter((g) => g.anio === selectedAnio && g.mes === selectedMes);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.numeroGuia.toLowerCase().includes(q) ||
          g.zona.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.fechaRecepcion.localeCompare(a.fechaRecepcion));
  }, [guias, selectedAnio, selectedMes, search]);

  // Búsqueda global (solo cuando no hay mes seleccionado)
  const resultadosBusqueda = useMemo(() => {
    if (!search.trim() || selectedMes) return [];
    const q = search.toLowerCase();
    return guias
      .filter(
        (g) =>
          g.numeroGuia.toLowerCase().includes(q) ||
          g.zona.toLowerCase().includes(q)
      )
      .sort((a, b) => b.fechaRecepcion.localeCompare(a.fechaRecepcion));
  }, [guias, search, selectedMes]);

  const resetForm = () => {
    setNumeroGuia("");
    setZona("");
    setSacos("");
    setKilos("");
    setFechaRecepcion("");
    setFile(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !numeroGuia || !zona || !sacos || !kilos || !fechaRecepcion) return;

    setSaving(true);
    try {
      const fileData = await fileToBase64(file);
      const fecha = new Date(fechaRecepcion + "T12:00:00");
      const nueva: Guia = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        numeroGuia: numeroGuia.trim(),
        zona: zona.trim(),
        sacos: Number(sacos),
        kilos: Number(kilos),
        fechaRecepcion,
        anio: fecha.getFullYear(),
        mes: fecha.getMonth() + 1,
        fileName: file.name,
        fileData,
        createdAt: new Date().toISOString(),
      };

      const updated = [nueva, ...guias];
      setGuias(updated);
      saveGuias(updated);
      setShowUpload(false);
      resetForm();
      setSelectedAnio(nueva.anio);
      setSelectedMes(nueva.mes);
      setSearch("");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar esta guía?")) return;
    const updated = guias.filter((g) => g.id !== id);
    setGuias(updated);
    saveGuias(updated);
    if (preview?.id === id) setPreview(null);
  };

  const totalKilosMes = guiasDelMes.reduce((s, g) => s + g.kilos, 0);
  const totalSacosMes = guiasDelMes.reduce((s, g) => s + g.sacos, 0);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-10">
            <div>
              <h1 className="text-[24px] font-semibold text-slate-800 tracking-tight mb-1.5">
                Gestión de Guías
              </h1>
              <p className="text-slate-500 text-[14px] leading-relaxed">
                Guías de remisión de cacao organizadas por año y mes
              </p>
            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-colors shrink-0"
            >
              <Upload size={16} />
              Subir guía
            </button>
          </div>

          {/* Buscador global */}
          <div className="relative mb-8 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar N° guía o zona..."
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          {/* Resultados de búsqueda global */}
          {search.trim() && !selectedMes && resultadosBusqueda.length > 0 && (
            <section className="mb-10">
              <h2 className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-4">
                Resultados de búsqueda
              </h2>
              <GuiaList
                items={resultadosBusqueda}
                onPreview={setPreview}
                onDelete={handleDelete}
                showFolder
              />
            </section>
          )}

          {/* ========== VISTA: Carpetas de AÑOS ========== */}
          {!selectedAnio && !search.trim() && (
            <section>
              <h2 className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-4">
                Carpetas por año
              </h2>

              {anios.length === 0 ? (
                <EmptyState onUpload={() => setShowUpload(true)} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {anios.map(({ anio, count }) => (
                    <button
                      key={anio}
                      onClick={() => {
                        setSelectedAnio(anio);
                        setSelectedMes(null);
                        setSearch("");
                      }}
                      className="group flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-blue-300 hover:shadow-md hover:shadow-blue-50/50 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                        <Folder size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-semibold text-slate-800">{anio}</p>
                        <p className="text-[13px] text-slate-500 mt-0.5">
                          {count} guía{count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ========== VISTA: Carpetas de MESES ========== */}
          {selectedAnio && !selectedMes && !search.trim() && (
            <section>
              <button
                onClick={() => setSelectedAnio(null)}
                className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-800 mb-6 transition-colors"
              >
                <ArrowLeft size={15} />
                Volver a años
              </button>

              <div className="mb-6">
                <h2 className="text-[18px] font-semibold text-slate-800">{selectedAnio}</h2>
                <p className="text-[13.5px] text-slate-500 mt-0.5">Selecciona un mes</p>
              </div>

              {mesesDelAnio.length === 0 ? (
                <p className="text-[14px] text-slate-400 py-8">No hay guías en este año.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mesesDelAnio.map(({ mes, count }) => (
                    <button
                      key={mes}
                      onClick={() => {
                        setSelectedMes(mes);
                        setSearch("");
                      }}
                      className="group flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-blue-300 hover:shadow-md hover:shadow-blue-50/50 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <FolderOpen size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-semibold text-slate-800">{MESES[mes - 1]}</p>
                        <p className="text-[13px] text-slate-500 mt-0.5">
                          {count} guía{count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ========== VISTA: LISTA DE GUÍAS DEL MES ========== */}
          {selectedAnio && selectedMes && (
            <section>
              <button
                onClick={() => setSelectedMes(null)}
                className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-800 mb-6 transition-colors"
              >
                <ArrowLeft size={15} />
                Volver a {selectedAnio}
              </button>

              <div className="mb-8">
                <h2 className="text-[18px] font-semibold text-slate-800">
                  {MESES[selectedMes - 1]} {selectedAnio}
                </h2>
                <p className="text-[13.5px] text-slate-500 mt-1">
                  {guiasDelMes.length} guía{guiasDelMes.length !== 1 ? "s" : ""}
                  {guiasDelMes.length > 0 && (
                    <>
                      {" · "}
                      {totalSacosMes.toLocaleString("es-PE")} sacos
                      {" · "}
                      {totalKilosMes.toLocaleString("es-PE", { maximumFractionDigits: 1 })} kg
                    </>
                  )}
                </p>
              </div>

              {guiasDelMes.length === 0 ? (
                <p className="text-[14px] text-slate-400 py-8">
                  No hay guías en este mes{search ? " con ese criterio" : ""}.
                </p>
              ) : (
                <GuiaList items={guiasDelMes} onPreview={setPreview} onDelete={handleDelete} />
              )}
            </section>
          )}

          {/* Búsqueda sin resultados */}
          {search.trim() && !selectedMes && resultadosBusqueda.length === 0 && (
            <p className="text-[14px] text-slate-400 py-6">No se encontraron guías.</p>
          )}
        </div>

        <footer className="py-3 text-center text-[11px] text-slate-400 border-t border-slate-100">
          Exportadora RomEx S.A. — QMS Sistema de Gestión de Laboratorio
        </footer>
      </main>

      {/* Modal subir */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-[16px] font-semibold text-slate-800">Subir guía</h2>
              <button
                onClick={() => {
                  setShowUpload(false);
                  resetForm();
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="px-6 py-6 space-y-5">
              <Field label="N° de guía">
                <input
                  required
                  value={numeroGuia}
                  onChange={(e) => setNumeroGuia(e.target.value)}
                  placeholder="EG07-00003608"
                  className={inputClass}
                />
              </Field>

              <Field label="Zona de procedencia">
                <input
                  required
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  placeholder="Neshuya, San José de Sisa..."
                  className={inputClass}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Sacos">
                  <input
                    required
                    type="number"
                    min={0}
                    value={sacos}
                    onChange={(e) => setSacos(e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </Field>
                <Field label="Kilos">
                  <input
                    required
                    type="number"
                    min={0}
                    step="0.01"
                    value={kilos}
                    onChange={(e) => setKilos(e.target.value)}
                    placeholder="0.00"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Fecha de recepción">
                <input
                  required
                  type="date"
                  value={fechaRecepcion}
                  onChange={(e) => setFechaRecepcion(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1.5 text-[12px] text-slate-400">
                  Define la carpeta año → mes automáticamente
                </p>
              </Field>

              <Field label="PDF de la guía">
                <input
                  required
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-[13px] text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:text-[13px] file:font-medium hover:file:bg-slate-200"
                />
              </Field>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpload(false);
                    resetForm();
                  }}
                  className="flex-1 h-11 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview PDF */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <div>
                <p className="text-[15px] font-semibold text-slate-800">{preview.numeroGuia}</p>
                <p className="text-[12.5px] text-slate-500 mt-0.5">
                  {preview.zona} · {preview.sacos} sacos ·{" "}
                  {preview.kilos.toLocaleString("es-PE")} kg · {preview.fechaRecepcion}
                </p>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>
            <iframe src={preview.fileData} className="flex-1 w-full" title={preview.numeroGuia} />
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-dashed border-slate-200 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
        <FolderOpen size={28} />
      </div>
      <p className="text-[15px] font-medium text-slate-700 mb-1">Sin guías todavía</p>
      <p className="text-[13.5px] text-slate-400 text-center max-w-xs mb-6">
        Sube la primera guía de remisión escaneada en PDF
      </p>
      <button
        onClick={onUpload}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-medium"
      >
        <Upload size={15} />
        Subir guía
      </button>
    </div>
  );
}

function GuiaList({
  items,
  onPreview,
  onDelete,
  showFolder = false,
}: {
  items: Guia[];
  onPreview: (g: Guia) => void;
  onDelete: (id: string) => void;
  showFolder?: boolean;
}) {
  return (
    <div className="space-y-3">
      {items.map((g) => (
        <div
          key={g.id}
          className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            <FileText size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-slate-800 truncate">{g.numeroGuia}</p>
            <p className="text-[13px] text-slate-500 mt-0.5 truncate">
              {g.zona}
              {showFolder && (
                <span className="text-slate-400">
                  {" · "}{MESES[g.mes - 1]} {g.anio}
                </span>
              )}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[13px] text-slate-600 shrink-0">
            <div className="text-right">
              <p className="font-medium">{g.sacos}</p>
              <p className="text-[11px] text-slate-400">sacos</p>
            </div>
            <div className="text-right min-w-[72px]">
              <p className="font-medium">{g.kilos.toLocaleString("es-PE", { maximumFractionDigits: 1 })}</p>
              <p className="text-[11px] text-slate-400">kg</p>
            </div>
            <div className="text-right min-w-[88px]">
              <p className="font-medium text-slate-700">{g.fechaRecepcion}</p>
              <p className="text-[11px] text-slate-400">recepción</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onPreview(g)}
              className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
              title="Ver PDF"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onDelete(g.id)}
              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
