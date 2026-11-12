"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Download,
  ExternalLink,
  Printer,
  Home,
  BarChart3,
  Settings,
  Headphones,
  LayoutDashboard,
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

type Vista = "inicio" | "carpetas" | "buscar";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guias));
  } catch {
    alert("No se pudo guardar (el PDF es muy grande). Usa un PDF más liviano.");
    throw new Error("storage_full");
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

function formatKilos(n: number) {
  return n.toLocaleString("es-PE", { maximumFractionDigits: 1 });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/pdf";
  const binary = atob(parts[1] || "");
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime || "application/pdf" });
}

function safeFileName(g: Guia) {
  if (g.fileName?.toLowerCase().endsWith(".pdf")) return g.fileName;
  return `${g.numeroGuia.replace(/[^a-zA-Z0-9-_]/g, "_") || "guia"}.pdf`;
}

function downloadGuia(g: Guia) {
  try {
    if (!g.fileData) {
      alert("No hay archivo PDF en esta guía.");
      return;
    }
    const blob = dataUrlToBlob(g.fileData);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = safeFileName(g);
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch {
    alert("No se pudo descargar el PDF.");
  }
}

function openInNewTab(g: Guia) {
  try {
    if (!g.fileData) return;
    const blob = dataUrlToBlob(g.fileData);
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) downloadGuia(g);
  } catch {
    alert("No se pudo abrir el PDF.");
  }
}

function printGuia(g: Guia) {
  try {
    if (!g.fileData) return;
    const blob = dataUrlToBlob(g.fileData);
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) {
      alert("Permite ventanas emergentes para imprimir.");
      return;
    }
    setTimeout(() => {
      try {
        w.focus();
        w.print();
      } catch {}
    }, 900);
  } catch {
    alert("No se pudo preparar la impresión.");
  }
}

export default function GuiasPage() {
  const [guias, setGuias] = useState<Guia[]>([]);
  const [vista, setVista] = useState<Vista>("inicio");
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
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setGuias(loadGuias());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const totales = useMemo(
    () => ({
      guias: guias.length,
      sacos: guias.reduce((s, g) => s + g.sacos, 0),
      kilos: guias.reduce((s, g) => s + g.kilos, 0),
    }),
    [guias]
  );

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
      saveGuias(updated);
      setGuias(updated);
      setShowUpload(false);
      resetForm();
      setVista("inicio");
      setSelectedAnio(nueva.anio);
      setSelectedMes(nueva.mes);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar esta guía?")) return;
    const updated = guias.filter((g) => g.id !== id);
    setGuias(updated);
    try {
      saveGuias(updated);
    } catch {}
    if (preview?.id === id) setPreview(null);
  };

  const totalKilosMes = guiasDelMes.reduce((s, g) => s + g.kilos, 0);
  const totalSacosMes = guiasDelMes.reduce((s, g) => s + g.sacos, 0);

  const irAInicio = () => {
    setVista("inicio");
    setSelectedAnio(null);
    setSelectedMes(null);
    limpiarBusqueda();
  };

  const irAArchivo = () => {
    setVista("carpetas");
    setSelectedAnio(null);
    setSelectedMes(null);
    limpiarBusqueda();
  };

  const stamp = now.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="min-h-screen flex bg-[#f0f2f7]">
      <aside className="hidden md:flex w-[232px] shrink-0 flex-col bg-[#f7f8fc] border-r border-slate-200/80">
        <div className="px-5 pt-5 pb-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/logo_romex.jpg"
              alt="RomEx"
              width={120}
              height={32}
              className="object-contain h-8 w-auto max-w-[130px]"
              style={{ mixBlendMode: "multiply" }}
              priority
            />
          </Link>
          <p className="text-[11px] text-slate-400 mt-1.5 pl-0.5">Gestión Documental</p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          <SideNav
            active={vista === "inicio" && !selectedAnio}
            icon={<Home size={16} />}
            label="Inicio"
            onClick={irAInicio}
          />
          <SideNav
            active={vista === "buscar" || (vista === "carpetas" && !!selectedMes)}
            icon={<FileText size={16} />}
            label="Guías"
            onClick={() => {
              setVista("buscar");
              setSelectedAnio(null);
              setSelectedMes(null);
            }}
          />
          <SideNav active={false} icon={<Package size={16} />} label="Sacos" onClick={irAInicio} />
          <SideNav active={false} icon={<Scale size={16} />} label="Kilos" onClick={irAInicio} />
          <div className="pt-3 pb-1 px-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Organización</p>
          </div>
          <SideNav
            active={vista === "carpetas" || vista === "inicio"}
            icon={<Folder size={16} />}
            label="Archivo"
            onClick={irAArchivo}
          />
          <SideNav active={false} icon={<BarChart3 size={16} />} label="Reportes" onClick={() => {}} />
          <SideNav active={false} icon={<Settings size={16} />} label="Configuración" onClick={() => {}} />
        </nav>

        <div className="px-3 pb-4">
          <button
            type="button"
            className="w-full flex items-center gap-2.5 h-11 px-3 rounded-xl border border-slate-200 bg-white text-left text-[12.5px] text-slate-600 hover:bg-slate-50"
          >
            <Headphones size={16} className="text-slate-400" />
            <span className="flex-1">
              <span className="block font-medium text-slate-700">Soporte</span>
              <span className="block text-[11px] text-slate-400">¿Necesitas ayuda?</span>
            </span>
            <ChevronRight size={14} className="text-slate-300" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[56px] bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center gap-3">
          <div className="flex items-center gap-2.5 min-w-0 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Files size={16} />
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="text-[13px] font-semibold text-slate-800 leading-none">Gestión de Guías</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Sistema de archivo</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVista("buscar");
                  setSelectedAnio(null);
                  setSelectedMes(null);
                }}
                placeholder="Buscar..."
                className="w-full h-9 pl-9 pr-3 rounded-full bg-slate-100 border-0 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={irAArchivo}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-[12.5px] font-medium hover:bg-amber-100"
            >
              <FolderOpen size={14} />
              Carpetas
            </button>
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-medium shadow-sm shadow-blue-600/20"
            >
              <Upload size={14} />
              <span className="hidden sm:inline">Subir guía</span>
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-slate-200 text-slate-600 text-[12.5px] font-medium hover:bg-slate-50"
            >
              <LayoutDashboard size={14} />
              <span className="hidden md:inline">Portal</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-[12px] font-semibold flex items-center justify-center">F</div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6 overflow-auto">
          {(vista === "inicio" || (vista === "carpetas" && !selectedAnio)) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <KpiCard icon={<FileText size={18} />} iconBg="bg-blue-50 text-blue-600" label="GUÍAS" value={String(totales.guias)} />
              <KpiCard icon={<Package size={18} />} iconBg="bg-emerald-50 text-emerald-600" label="SACOS" value={totales.sacos.toLocaleString("es-PE")} />
              <KpiCard icon={<Scale size={18} />} iconBg="bg-violet-50 text-violet-600" label="KILOS" value={formatKilos(totales.kilos)} />
            </div>
          )}

          {(vista === "inicio" || vista === "carpetas") && !selectedAnio && (
            <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <Folder size={16} className="text-blue-600" />
                <h2 className="text-[14px] font-semibold text-slate-800">Archivo por Año</h2>
              </div>
              <div className="p-4">
                {anios.length === 0 ? (
                  <EmptyState onUpload={() => setShowUpload(true)} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {anios.map(({ anio, count }) => (
                      <button
                        key={anio}
                        type="button"
                        onClick={() => {
                          setVista("carpetas");
                          setSelectedAnio(anio);
                          setSelectedMes(null);
                        }}
                        className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm text-left transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Folder size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-semibold text-slate-800">{anio}</p>
                          <p className="text-[12.5px] text-slate-500">{count} guía{count !== 1 ? "s" : ""}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {vista === "carpetas" && selectedAnio && !selectedMes && (
            <section>
              <button type="button" onClick={() => setSelectedAnio(null)} className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-800 mb-4">
                <ArrowLeft size={14} /> Volver a años
              </button>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h2 className="text-[15px] font-semibold text-slate-800">{selectedAnio}</h2>
                  <p className="text-[12.5px] text-slate-500 mt-0.5">Selecciona un mes</p>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mesesDelAnio.map(({ mes, count }) => (
                    <button
                      key={mes}
                      type="button"
                      onClick={() => setSelectedMes(mes)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm text-left transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                        <FolderOpen size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-slate-800">{MESES[mes - 1]}</p>
                        <p className="text-[12.5px] text-slate-500">{count} guía{count !== 1 ? "s" : ""}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {vista === "carpetas" && selectedAnio && selectedMes && (
            <section>
              <button type="button" onClick={() => setSelectedMes(null)} className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-800 mb-4">
                <ArrowLeft size={14} /> Volver a {selectedAnio}
              </button>
              <div className="mb-4">
                <h2 className="text-[17px] font-semibold text-slate-800">{MESES[selectedMes - 1]} {selectedAnio}</h2>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  {guiasDelMes.length} guía{guiasDelMes.length !== 1 ? "s" : ""}
                  {guiasDelMes.length > 0 && (
                    <> · {totalSacosMes.toLocaleString("es-PE")} sacos · {formatKilos(totalKilosMes)} kg</>
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

          {vista === "buscar" && (
            <section>
              <div className="mb-5">
                <h2 className="text-[17px] font-semibold text-slate-800 mb-1">Buscar guías</h2>
                <p className="text-[13px] text-slate-500">N° de guía o zona · filtros de año y mes</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <select value={filtroAnio} onChange={(e) => setFiltroAnio(e.target.value)} className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-blue-500 min-w-[130px]">
                  <option value="">Todos los años</option>
                  {aniosDisponibles.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)} className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-blue-500 min-w-[150px]">
                  <option value="">Todos los meses</option>
                  {MESES.map((nombre, i) => (
                    <option key={nombre} value={i + 1}>{nombre}</option>
                  ))}
                </select>
                {hayFiltros && (
                  <button type="button" onClick={limpiarBusqueda} className="h-10 px-4 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-white">Limpiar</button>
                )}
              </div>
              {!hayFiltros && (
                <div className="flex flex-col items-center py-14 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                  <Search size={22} className="text-slate-300 mb-3" />
                  <p className="text-[14px] text-slate-500">Busca o filtra para ver resultados</p>
                </div>
              )}
              {hayFiltros && resultadosBusqueda.length === 0 && (
                <p className="text-[14px] text-slate-400 py-8">No se encontraron guías.</p>
              )}
              {hayFiltros && resultadosBusqueda.length > 0 && (
                <div>
                  <p className="text-[13px] text-slate-500 mb-3">{resultadosBusqueda.length} resultado{resultadosBusqueda.length !== 1 ? "s" : ""}</p>
                  <GuiaList items={resultadosBusqueda} onPreview={setPreview} onDelete={handleDelete} showFolder />
                </div>
              )}
            </section>
          )}
        </main>

        <footer className="px-4 sm:px-6 py-2.5 border-t border-slate-200/70 bg-white/70 flex items-center justify-between text-[11px] text-slate-400">
          <span>RomEx S.A. — Gestión de Guías</span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Sistema en línea</span>
            <span className="text-slate-300">|</span>
            <span>{stamp}</span>
          </span>
        </footer>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-[16px] font-semibold text-slate-800">Subir guía PDF</h3>
              <button type="button" onClick={() => { setShowUpload(false); resetForm(); }} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleUpload} className="px-6 py-5 space-y-4">
              <Field label="Archivo PDF">
                <input required type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-[13px] text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-[13px] file:font-medium" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="N° de guía"><input required value={numeroGuia} onChange={(e) => setNumeroGuia(e.target.value)} placeholder="EG07-3261" className={inputClass} /></Field>
                <Field label="Fecha de recepción"><input required type="date" value={fechaRecepcion} onChange={(e) => setFechaRecepcion(e.target.value)} className={inputClass} /></Field>
              </div>
              <Field label="Zona / procedencia"><input required value={zona} onChange={(e) => setZona(e.target.value)} placeholder="Yurimaguas, Quillabamba..." className={inputClass} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Cantidad de sacos"><input required type="number" min={0} value={sacos} onChange={(e) => setSacos(e.target.value)} className={inputClass} /></Field>
                <Field label="Kilos"><input required type="number" min={0} step="0.1" value={kilos} onChange={(e) => setKilos(e.target.value)} className={inputClass} /></Field>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowUpload(false); resetForm(); }} className="h-11 px-5 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600">Cancelar</button>
                <button type="submit" disabled={saving} className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium disabled:opacity-60">{saving ? "Guardando..." : "Guardar guía"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/50 backdrop-blur-[2px]">
          <div className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-slate-800 truncate">{preview.numeroGuia}</p>
              <p className="text-[12px] text-slate-500 truncate">{preview.zona} · {preview.sacos} sacos · {formatKilos(preview.kilos)} kg</p>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => openInNewTab(preview)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" title="Abrir"><ExternalLink size={16} /></button>
              <button type="button" onClick={() => downloadGuia(preview)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" title="Descargar"><Download size={16} /></button>
              <button type="button" onClick={() => printGuia(preview)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" title="Imprimir"><Printer size={16} /></button>
              <button type="button" onClick={() => setPreview(null)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
          </div>
          <div className="flex-1 bg-slate-200/80 p-3 sm:p-6 overflow-auto">
            {preview.fileData ? (
              <iframe title={preview.numeroGuia} src={preview.fileData} className="w-full h-full min-h-[70vh] rounded-xl bg-white shadow-lg" />
            ) : (
              <p className="text-center text-slate-500 py-20">Sin PDF</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SideNav({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 h-10 px-3 rounded-xl text-[13px] font-medium transition-colors ${
        active ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20" : "text-slate-600 hover:bg-white hover:text-slate-900"
      }`}
    >
      <span className={active ? "text-white" : "text-slate-400"}>{icon}</span>
      {label}
    </button>
  );
}

function KpiCard({ icon, iconBg, label, value }: { icon: React.ReactNode; iconBg: string; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5 shadow-sm">
      <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <p className="text-[11px] font-semibold text-slate-400 tracking-wide">{label}</p>
        <p className="text-[22px] font-bold text-slate-800 tabular-nums leading-tight">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
        <FolderOpen size={22} />
      </div>
      <p className="text-[14px] font-medium text-slate-800 mb-1">Sin guías aún</p>
      <p className="text-[13px] text-slate-400 mb-4 max-w-sm">Sube la primera guía PDF para empezar el archivo por año y mes.</p>
      <button type="button" onClick={onUpload} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 text-white text-[13px] font-medium">
        <Upload size={15} /> Subir guía
      </button>
    </div>
  );
}

function GuiaList({ items, onPreview, onDelete, showFolder }: { items: Guia[]; onPreview: (g: Guia) => void; onDelete: (id: string) => void; showFolder?: boolean }) {
  return (
    <div className="space-y-2">
      {items.map((g) => (
        <div key={g.id} className="flex items-center gap-3.5 p-3.5 sm:p-4 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-slate-800 truncate">{g.numeroGuia}</p>
            <p className="text-[12.5px] text-slate-500 mt-0.5 truncate">
              {g.zona}
              {showFolder && <span className="text-slate-400"> · {MESES[g.mes - 1]} {g.anio}</span>}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-[13px] text-slate-600 shrink-0">
            <div className="text-right"><p className="font-medium tabular-nums">{g.sacos}</p><p className="text-[11px] text-slate-400">sacos</p></div>
            <div className="text-right min-w-[72px]"><p className="font-medium tabular-nums">{formatKilos(g.kilos)}</p><p className="text-[11px] text-slate-400">kg</p></div>
            <div className="text-right min-w-[88px]"><p className="font-medium text-slate-700">{g.fechaRecepcion}</p><p className="text-[11px] text-slate-400">recepción</p></div>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button type="button" onClick={() => onPreview(g)} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600" title="Ver PDF"><Eye size={16} /></button>
            <button type="button" onClick={() => downloadGuia(g)} className="p-2 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600" title="Descargar"><Download size={16} /></button>
            <button type="button" onClick={() => onDelete(g.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500" title="Eliminar"><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
