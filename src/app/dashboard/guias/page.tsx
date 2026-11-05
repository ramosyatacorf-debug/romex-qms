"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  FolderOpen,
  Upload,
  Search,
  FileText,
  ChevronRight,
  ChevronLeft,
  X,
  Trash2,
  Eye,
  Calendar,
} from "lucide-react";

interface Guia {
  id: string;
  numeroGuia: string;
  zona: string;
  sacos: number;
  kilos: number;
  fechaRecepcion: string; // YYYY-MM-DD
  anio: number;
  mes: number; // 1-12
  fileName: string;
  fileData: string; // base64
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

  // Formulario subir
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
    const set = new Set(guias.map((g) => g.anio));
    return Array.from(set).sort((a, b) => b - a);
  }, [guias]);

  const mesesDelAnio = useMemo(() => {
    if (!selectedAnio) return [];
    const set = new Set(guias.filter((g) => g.anio === selectedAnio).map((g) => g.mes));
    return Array.from(set).sort((a, b) => b - a);
  }, [guias, selectedAnio]);

  const guiasFiltradas = useMemo(() => {
    let list = guias;
    if (selectedAnio) list = list.filter((g) => g.anio === selectedAnio);
    if (selectedMes) list = list.filter((g) => g.mes === selectedMes);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.numeroGuia.toLowerCase().includes(q) ||
          g.zona.toLowerCase().includes(q) ||
          g.fileName.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.fechaRecepcion.localeCompare(a.fechaRecepcion));
  }, [guias, selectedAnio, selectedMes, search]);

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

  const breadcrumb = () => {
    if (!selectedAnio) return "Todas las guías";
    if (!selectedMes) return `${selectedAnio}`;
    return `${selectedAnio} → ${MESES[selectedMes - 1]}`;
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-6 py-7 md:px-10 md:py-9">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                  <FolderOpen size={16} />
                </div>
                <h1 className="text-[22px] font-semibold text-slate-800 tracking-tight">
                  Gestión de Guías
                </h1>
              </div>
              <p className="text-slate-500 text-[13.5px]">
                Almacenamiento de guías de remisión de cacao · organizadas por año y mes
              </p>
            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-medium transition-colors"
            >
              <Upload size={15} />
              Subir guía
            </button>
          </div>

          {/* Navegación año / mes */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <button
              onClick={() => {
                setSelectedAnio(null);
                setSelectedMes(null);
              }}
              className={`h-8 px-3 rounded-lg text-[12.5px] font-medium transition-colors ${
                !selectedAnio
                  ? "bg-slate-800 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Todas
            </button>

            {selectedAnio && (
              <button
                onClick={() => setSelectedMes(null)}
                className="h-8 px-2 text-slate-400 hover:text-slate-600"
              >
                <ChevronLeft size={16} />
              </button>
            )}

            {/* Años */}
            {!selectedAnio &&
              anios.map((anio) => (
                <button
                  key={anio}
                  onClick={() => {
                    setSelectedAnio(anio);
                    setSelectedMes(null);
                  }}
                  className="h-8 px-3 rounded-lg text-[12.5px] font-medium bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  {anio}
                </button>
              ))}

            {/* Meses del año seleccionado */}
            {selectedAnio &&
              !selectedMes &&
              mesesDelAnio.map((mes) => {
                const count = guias.filter((g) => g.anio === selectedAnio && g.mes === mes).length;
                return (
                  <button
                    key={mes}
                    onClick={() => setSelectedMes(mes)}
                    className="h-8 px-3 rounded-lg text-[12.5px] font-medium bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    {MESES[mes - 1]} ({count})
                  </button>
                );
              })}

            {selectedAnio && selectedMes && (
              <span className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                <Calendar size={14} className="text-slate-400" />
                {breadcrumb()}
              </span>
            )}

            {anios.length === 0 && (
              <span className="text-[13px] text-slate-400">Aún no hay guías cargadas</span>
            )}
          </div>

          {/* Buscador */}
          <div className="relative max-w-md mb-5">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por N° guía, zona..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          {/* Tabla */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[720px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="px-4 py-3 text-[11.5px] font-medium text-slate-500">N° Guía</th>
                    <th className="px-4 py-3 text-[11.5px] font-medium text-slate-500">Zona</th>
                    <th className="px-4 py-3 text-[11.5px] font-medium text-slate-500">Sacos</th>
                    <th className="px-4 py-3 text-[11.5px] font-medium text-slate-500">Kilos</th>
                    <th className="px-4 py-3 text-[11.5px] font-medium text-slate-500">Recepción</th>
                    <th className="px-4 py-3 text-[11.5px] font-medium text-slate-500">PDF</th>
                    <th className="px-4 py-3 text-[11.5px] font-medium text-slate-500 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {guiasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-[13.5px] text-slate-400">
                        No hay guías en esta vista. Sube la primera con el botón "Subir guía".
                      </td>
                    </tr>
                  ) : (
                    guiasFiltradas.map((g) => (
                      <tr
                        key={g.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                              <FileText size={14} />
                            </div>
                            <span className="text-[13px] font-medium text-slate-800">{g.numeroGuia}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[13px] text-slate-600">{g.zona}</td>
                        <td className="px-4 py-3.5 text-[13px] text-slate-700">{g.sacos}</td>
                        <td className="px-4 py-3.5 text-[13px] text-slate-700">
                          {g.kilos.toLocaleString("es-PE", { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3.5 text-[13px] text-slate-500">{g.fechaRecepcion}</td>
                        <td className="px-4 py-3.5 text-[12px] text-slate-400 truncate max-w-[140px]">
                          {g.fileName}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setPreview(g)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                              title="Ver PDF"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(g.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {guiasFiltradas.length > 0 && (
            <p className="mt-3 text-[12px] text-slate-400">
              {guiasFiltradas.length} guía{guiasFiltradas.length !== 1 ? "s" : ""}
              {selectedAnio ? ` · ${breadcrumb()}` : ""}
            </p>
          )}
        </div>

        <footer className="py-3 text-center text-[11px] text-slate-400 border-t border-slate-100">
          Exportadora RomEx S.A. — QMS Sistema de Gestión de Laboratorio
        </footer>
      </main>

      {/* Modal subir */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-[16px] font-semibold text-slate-800">Subir guía de remisión</h2>
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

            <form onSubmit={handleUpload} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
                  N° de guía
                </label>
                <input
                  required
                  value={numeroGuia}
                  onChange={(e) => setNumeroGuia(e.target.value)}
                  placeholder="Ej: EG07-00003608"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13.5px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
                  Zona de procedencia
                </label>
                <input
                  required
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  placeholder="Ej: Neshuya, San José de Sisa..."
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13.5px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
                    Cantidad de sacos
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={sacos}
                    onChange={(e) => setSacos(e.target.value)}
                    placeholder="0"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13.5px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
                    Kilos
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    step="0.01"
                    value={kilos}
                    onChange={(e) => setKilos(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13.5px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
                  Fecha de recepción
                </label>
                <input
                  required
                  type="date"
                  value={fechaRecepcion}
                  onChange={(e) => setFechaRecepcion(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13.5px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Se guarda automáticamente en la carpeta del año y mes de esta fecha
                </p>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
                  Archivo PDF de la guía
                </label>
                <input
                  required
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-[13px] text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:text-[12.5px] file:font-medium hover:file:bg-slate-200"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpload(false);
                    resetForm();
                  }}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-[13.5px] font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-medium disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar guía"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal preview PDF */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
              <div>
                <p className="text-[14px] font-semibold text-slate-800">{preview.numeroGuia}</p>
                <p className="text-[12px] text-slate-500">
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
