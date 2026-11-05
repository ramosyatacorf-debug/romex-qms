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
  Package,
  Scale,
  Files,
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

type Vista = "carpetas" | "buscar";

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

function formatKilos(n: number) {
  return n.toLocaleString("es-PE", { maximumFractionDigits: 1 });
}

export default function GuiasPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [guias, setGuias] = useState<Guia[]>([]);
  const [vista, setVista] = useState<Vista>("carpetas");

  const [selectedAnio, setSelectedAnio] = useState<number | null>(null);
  const [selectedMes, setSelectedMes] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [filtroMes, setFiltroMes] = useState("");

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

  const totales = useMemo(() => {
    return {
      guias: guias.length,
      sacos: guias.reduce((s, g) => s + g.sacos, 0),
      kilos: guias.reduce((s, g) => s + g.kilos, 0),
    };
  }, [guias]);

  const anios = useMemo(() => {
    const map = new Map<number, number>();
    guias.forEach((g) => map.set(g.anio, (map.get(g.anio) || 0) + 1));
    return Array.from(map.entries())
      .map(([anio, count]) => ({ anio, count }))
      .sort((a, b) => b.anio - a.anio);
  }, [guias]);

  const aniosDisponibles = useMemo(
    () => Array.from(new Set(guias.map((g) => g.anio))).sort((a, b) => b - a),
    [guias]
  );

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
    return guias
      .filter((g) => g.anio === selectedAnio && g.mes === selectedMes)
      .sort((a, b) => b.fechaRecepcion.localeCompare(a.fechaRecepcion));
  }, [guias, selectedAnio, selectedMes]);

  const hayFiltros =
    searchQuery.trim() !== "" || filtroAnio !== "" || filtroMes !== "";

  const resultadosBusqueda = useMemo(() => {
    if (!hayFiltros) return [];
    const q = searchQuery.trim().toLowerCase();
    return guias
      .filter((g) => {
        const matchTexto =
          !q ||
          g.numeroGuia.toLowerCase().includes(q) ||
          g.zona.toLowerCase().includes(q);
        const matchAnio = !filtroAnio || g.anio === Number(filtroAnio);
        const matchMes = !filtroMes || g.mes === Number(filtroMes);
        return matchTexto && matchAnio && matchMes;
      })
      .sort((a, b) => b.fechaRecepcion.localeCompare(a.fechaRecepcion));
  }, [guias, searchQuery, filtroAnio, filtroMes, hayFiltros]);

  const resetForm = () => {
    setNumeroGuia("");
    setZona("");
    setSacos("");
    setKilos("");
    setFechaRecepcion("");
    setFile(null);
  };

  const limpiarBusqueda = () => {
    setSearchQuery("");
    setFiltroAnio("");
    setFiltroMes("");
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
      setVista("carpetas");
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

  const totalKilosMes = guiasDelMes.reduce((s, g) => s + g.kilos, 0);
  const totalSacosMes = guiasDelMes.reduce((s, g) => s + g.sacos, 0);

  const cambiarVista = (v: Vista) => {
    setVista(v);
    if (v === "carpetas") limpiarBusqueda();
    else {
      setSelectedAnio(null);
      setSelectedMes(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
            <div>
              <h1 className="text-[24px] font-semibold text-slate-800 tracking-tight mb-1.5">
                Gestión de Guías
              </h1>
              <p className="text-slate-500 text-[14px]">
                Guías de remisión de cacao · archivo por año y mes
              </p>
            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-colors shrink-0 shadow-sm shadow-blue-600/20"
            >
              <Upload size={16} />
              Subir guía
            </button>
          </div>

          {/* Resumen global */}
          {guias.length > 0 && vista === "carpetas" && !selectedAnio && (
            <div className="grid grid-cols-3 gap-3 mb-8">
              <StatCard icon={<Files size={16} />} label="Guías" value={String(totales.guias)} />
              <StatCard icon={<Package size={16} />} label="Sacos" value={totales.sacos.toLocaleString("es-PE")} />
              <StatCard icon={<Scale size={16} />} label="Kilos" value={formatKilos(totales.kilos)} />
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-8 w-fit">
            <TabBtn active={vista === "carpetas"} onClick={() => cambiarVista("carpetas")} icon={<Folder size={15} />} label="Carpetas" />
            <TabBtn active={vista === "buscar"} onClick={() => cambiarVista("buscar")} icon={<Search size={15} />} label="Buscar" />
          </div>

          {/* ========== CARPETAS ========== */}
          {vista === "carpetas" && (
            <>
              {!selectedAnio && (
                <section>
                  <h2 className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-4">
                    Archivo por año
                  </h2>
                  {anios.length === 0 ? (
                    <EmptyState onUpload={() => setShowUpload(true)} />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {anios.map(({ anio, count }) => (
                        <FolderCard
                          key={anio}
                          title={String(anio)}
                          subtitle={`${count} guía${count !== 1 ? "s" : ""}`}
                          tone="amber"
                          onClick={() => {
                            setSelectedAnio(anio);
                            setSelectedMes(null);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )}

              {selectedAnio && !selectedMes && (
                <section>
                  <BackBtn label="Volver a años" onClick={() => setSelectedAnio(null)} />
                  <div className="mb-6">
                    <h2 className="text-[18px] font-semibold text-slate-800">{selectedAnio}</h2>
                    <p className="text-[13.5px] text-slate-500 mt-0.5">Selecciona un mes</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mesesDelAnio.map(({ mes, count }) => (
                      <FolderCard
                        key={mes}
                        title={MESES[mes - 1]}
                        subtitle={`${count} guía${count !== 1 ? "s" : ""}`}
                        tone="blue"
                        open
                        onClick={() => setSelectedMes(mes)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {selectedAnio && selectedMes && (
                <section>
                  <BackBtn label={`Volver a ${selectedAnio}`} onClick={() => setSelectedMes(null)} />
                  <div className="mb-6">
                    <h2 className="text-[18px] font-semibold text-slate-800">
                      {MESES[selectedMes - 1]} {selectedAnio}
                    </h2>
                    <p className="text-[13.5px] text-slate-500 mt-1">
                      {guiasDelMes.length} guía{guiasDelMes.length !== 1 ? "s" : ""}
                      {guiasDelMes.length > 0 && (
                        <>
                          {" · "}{totalSacosMes.toLocaleString("es-PE")} sacos
                          {" · "}{formatKilos(totalKilosMes)} kg
                        </>
                      )}
                    </p>
                  </div>
                  {guiasDelMes.length === 0 ? (
                    <p className="text-[14px] text-slate-400 py-8">No hay guías en este mes.</p>
                  ) : (
                    <GuiaList items={guiasDelMes} onPreview={setPreview} onDelete={handleDelete} />
                  )}
                </section>
              )}
            </>
          )}

          {/* ========== BUSCAR ========== */}
          {vista === "buscar" && (
            <section>
              <div className="mb-6">
                <h2 className="text-[18px] font-semibold text-slate-800 mb-1">Buscar guías</h2>
                <p className="text-[13.5px] text-slate-500">
                  N° de guía o zona · filtros de año y mes
                </p>
              </div>

              <div className="relative mb-4 max-w-xl">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="N° de guía o zona de procedencia..."
                  className="w-full h-12 pl-12 pr-12 rounded-2xl border border-slate-200 bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <select
                  value={filtroAnio}
                  onChange={(e) => setFiltroAnio(e.target.value)}
                  className="h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-[13.5px] text-slate-700 outline-none focus:border-blue-500 min-w-[130px]"
                >
                  <option value="">Todos los años</option>
                  {aniosDisponibles.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>

                <select
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  className="h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-[13.5px] text-slate-700 outline-none focus:border-blue-500 min-w-[150px]"
                >
                  <option value="">Todos los meses</option>
                  {MESES.map((nombre, i) => (
                    <option key={nombre} value={i + 1}>{nombre}</option>
                  ))}
                </select>

                {hayFiltros && (
                  <button
                    onClick={limpiarBusqueda}
                    className="h-11 px-4 rounded-xl border border-slate-200 text-[13.5px] font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>

              {!hayFiltros && (
                <div className="flex flex-col items-center py-14 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
                    <Search size={22} />
                  </div>
                  <p className="text-[14px] text-slate-500 mb-1">Busca o filtra para ver resultados</p>
                  <p className="text-[12.5px] text-slate-400 max-w-sm">
                    Barra: N° guía o zona · Selectores: año y mes
                  </p>
                </div>
              )}

              {hayFiltros && resultadosBusqueda.length === 0 && (
                <p className="text-[14px] text-slate-400 py-8">No se encontraron guías.</p>
              )}

              {hayFiltros && resultadosBusqueda.length > 0 && (
                <div>
                  <p className="text-[13px] text-slate-500 mb-4">
                    {resultadosBusqueda.length} resultado{resultadosBusqueda.length !== 1 ? "s" : ""}
                  </p>
                  <GuiaList items={resultadosBusqueda} onPreview={setPreview} onDelete={handleDelete} showFolder />
                </div>
              )}
            </section>
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
              <div>
                <h2 className="text-[16px] font-semibold text-slate-800">Subir guía</h2>
                <p className="text-[12.5px] text-slate-500 mt-0.5">PDF de remisión + datos de recepción</p>
              </div>
              <button onClick={() => { setShowUpload(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="px-6 py-6 space-y-5">
              <Field label="N° de guía">
                <input required value={numeroGuia} onChange={(e) => setNumeroGuia(e.target.value)} placeholder="EG07-00003608" className={inputClass} />
              </Field>
              <Field label="Zona de procedencia">
                <input required value={zona} onChange={(e) => setZona(e.target.value)} placeholder="Neshuya, San José de Sisa..." className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Sacos">
                  <input required type="number" min={0} value={sacos} onChange={(e) => setSacos(e.target.value)} placeholder="0" className={inputClass} />
                </Field>
                <Field label="Kilos">
                  <input required type="number" min={0} step="0.01" value={kilos} onChange={(e) => setKilos(e.target.value)} placeholder="0.00" className={inputClass} />
                </Field>
              </div>
              <Field label="Fecha de recepción">
                <input required type="date" value={fechaRecepcion} onChange={(e) => setFechaRecepcion(e.target.value)} className={inputClass} />
                <p className="mt-1.5 text-[12px] text-slate-400">Organiza automáticamente en año → mes</p>
              </Field>
              <Field label="Archivo PDF">
                <input required type="file" accept="application/pdf,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-[13px] text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:text-[13px] file:font-medium hover:file:bg-slate-200" />
              </Field>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowUpload(false); resetForm(); }} className="flex-1 h-11 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium disabled:opacity-60">
                  {saving ? "Guardando..." : "Guardar guía"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <div>
                <p className="text-[15px] font-semibold text-slate-800">{preview.numeroGuia}</p>
                <p className="text-[12.5px] text-slate-500 mt-0.5">
                  {preview.zona} · {preview.sacos} sacos · {formatKilos(preview.kilos)} kg · {preview.fechaRecepcion}
                </p>
              </div>
              <button onClick={() => setPreview(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
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

function TabBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg text-[13.5px] font-medium transition-colors ${
        active ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-[16px] font-semibold text-slate-800 tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function BackBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-800 mb-6 transition-colors">
      <ArrowLeft size={15} />
      {label}
    </button>
  );
}

function FolderCard({
  title,
  subtitle,
  tone,
  open = false,
  onClick,
}: {
  title: string;
  subtitle: string;
  tone: "amber" | "blue";
  open?: boolean;
  onClick: () => void;
}) {
  const colors =
    tone === "amber"
      ? "bg-amber-50 text-amber-600"
      : "bg-blue-50 text-blue-600";

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-blue-300 hover:shadow-md hover:shadow-blue-50/50 transition-all"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors}`}>
        {open ? <FolderOpen size={22} /> : <Folder size={22} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-semibold text-slate-800">{title}</p>
        <p className="text-[13px] text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500" />
    </button>
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
      <button onClick={onUpload} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-medium">
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
        <div key={g.id} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            <FileText size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-slate-800 truncate">{g.numeroGuia}</p>
            <p className="text-[13px] text-slate-500 mt-0.5 truncate">
              {g.zona}
              {showFolder && <span className="text-slate-400"> · {MESES[g.mes - 1]} {g.anio}</span>}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-[13px] text-slate-600 shrink-0">
            <div className="text-right">
              <p className="font-medium tabular-nums">{g.sacos}</p>
              <p className="text-[11px] text-slate-400">sacos</p>
            </div>
            <div className="text-right min-w-[72px]">
              <p className="font-medium tabular-nums">{formatKilos(g.kilos)}</p>
              <p className="text-[11px] text-slate-400">kg</p>
            </div>
            <div className="text-right min-w-[88px]">
              <p className="font-medium text-slate-700">{g.fechaRecepcion}</p>
              <p className="text-[11px] text-slate-400">recepción</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onPreview(g)} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600" title="Ver PDF">
              <Eye size={16} />
            </button>
            <button onClick={() => onDelete(g.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500" title="Eliminar">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
