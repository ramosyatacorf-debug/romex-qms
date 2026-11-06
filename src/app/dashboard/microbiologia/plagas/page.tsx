"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ChevronRight, ArrowLeft, Plus, Save, Trash2, Eye } from "lucide-react";

interface EventoPlaga {
  id: string;
  fecha: string;
  area: string;
  plaga: "ave" | "roedor";
  muertos: number;
  vivos: number;
  zona: string;
  observaciones: string;
  inspector: string;
  createdAt: string;
}

const STORAGE_KEY = "romex_plagas";

function load(): EventoPlaga[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(items: EventoPlaga[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function fmt(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function PlagasPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState<EventoPlaga[]>([]);
  const [mode, setMode] = useState<"lista" | "nuevo" | "ver">("lista");
  const [selected, setSelected] = useState<EventoPlaga | null>(null);

  const [fecha, setFecha] = useState("");
  const [area, setArea] = useState("");
  const [plaga, setPlaga] = useState<"ave" | "roedor">("ave");
  const [muertos, setMuertos] = useState("0");
  const [vivos, setVivos] = useState("1");
  const [zona, setZona] = useState("");
  const [obs, setObs] = useState("c");
  const [inspector, setInspector] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => setItems(load()), []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [items]
  );

  const totalesMes = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const prefix = `${y}-${m}`;
    const delMes = items.filter((i) => i.fecha.startsWith(prefix));
    return {
      aves: delMes.filter((i) => i.plaga === "ave").reduce((s, i) => s + i.muertos + i.vivos, 0),
      roedores: delMes.filter((i) => i.plaga === "roedor").reduce((s, i) => s + i.muertos + i.vivos, 0),
    };
  }, [items]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha || !area) return;
    setSaving(true);
    try {
      const nuevo: EventoPlaga = {
        id: `${Date.now()}`,
        fecha,
        area: area.trim(),
        plaga,
        muertos: Number(muertos) || 0,
        vivos: Number(vivos) || 0,
        zona: zona.trim(),
        observaciones: obs,
        inspector: inspector.trim() || "—",
        createdAt: new Date().toISOString(),
      };
      const updated = [nuevo, ...items];
      setItems(updated);
      save(updated);
      setMode("lista");
      setFecha("");
      setArea("");
      setZona("");
      setObs("c");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar evento?")) return;
    const updated = items.filter((x) => x.id !== id);
    setItems(updated);
    save(updated);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">
          <div className="flex items-center gap-2 text-[13px] text-slate-400 mb-4">
            <Link href="/dashboard" className="hover:text-slate-600">Inicio</Link>
            <ChevronRight size={14} />
            <Link href="/dashboard/microbiologia" className="hover:text-slate-600">Microbiología</Link>
            <ChevronRight size={14} />
            <span className="text-slate-600">Plagas</span>
          </div>

          {mode === "lista" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-[11px] font-medium text-slate-400 mb-1">LM-CP-R-004</p>
                  <h1 className="text-[22px] font-semibold text-slate-800 mb-1">Control de plagas</h1>
                  <p className="text-[13.5px] text-slate-500">Registro cada vez que se observe ave o roedor</p>
                </div>
                <button onClick={() => setMode("nuevo")} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium">
                  <Plus size={16} /> Registrar evento
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-[12px] text-slate-500">Aves este mes</p>
                  <p className="text-[22px] font-semibold text-slate-800">{totalesMes.aves}</p>
                  <p className="text-[11px] text-amber-600 mt-1">Umbral: >5 requiere empresa tercera</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-[12px] text-slate-500">Roedores este mes</p>
                  <p className="text-[22px] font-semibold text-slate-800">{totalesMes.roedores}</p>
                  <p className="text-[11px] text-amber-600 mt-1">Umbral: >3 requiere empresa tercera</p>
                </div>
              </div>

              {sorted.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500 text-[14px]">Sin eventos registrados</div>
              ) : (
                <div className="space-y-3">
                  {sorted.map((r) => (
                    <div key={r.id} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl">
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-slate-800">
                          {fmt(r.fecha)} · {r.plaga === "ave" ? "Ave" : "Roedor"} · total {r.muertos + r.vivos}
                        </p>
                        <p className="text-[13px] text-slate-500">{r.area} · {r.zona || "sin zona"}</p>
                      </div>
                      <button onClick={() => { setSelected(r); setMode("ver"); }} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Eye size={16} /></button>
                      <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {mode === "nuevo" && (
            <form onSubmit={handleSave} className="max-w-xl">
              <button type="button" onClick={() => setMode("lista")} className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 mb-6">
                <ArrowLeft size={15} /> Volver
              </button>
              <h1 className="text-[20px] font-semibold text-slate-800 mb-6">Registrar avistamiento</h1>
              <div className="space-y-4 mb-6">
                <Field label="Fecha"><input required type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} /></Field>
                <Field label="Área"><input required value={area} onChange={(e) => setArea(e.target.value)} placeholder="Mantenimiento, patio de maniobras..." className={inputClass} /></Field>
                <Field label="Zona de ubicación"><input value={zona} onChange={(e) => setZona(e.target.value)} placeholder="Frente al comedor, cercano al shiller..." className={inputClass} /></Field>
                <Field label="Plaga">
                  <select value={plaga} onChange={(e) => setPlaga(e.target.value as "ave" | "roedor")} className={inputClass}>
                    <option value="ave">Ave</option>
                    <option value="roedor">Roedor</option>
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Muertos"><input type="number" min={0} value={muertos} onChange={(e) => setMuertos(e.target.value)} className={inputClass} /></Field>
                  <Field label="Vivos"><input type="number" min={0} value={vivos} onChange={(e) => setVivos(e.target.value)} className={inputClass} /></Field>
                </div>
                <Field label="Observaciones"><input value={obs} onChange={(e) => setObs(e.target.value)} placeholder="c" className={inputClass} /></Field>
                <Field label="Inspector"><input value={inspector} onChange={(e) => setInspector(e.target.value)} placeholder="Nereyda" className={inputClass} /></Field>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setMode("lista")} className="h-11 px-5 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600">Cancelar</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 text-white text-[14px] font-medium disabled:opacity-60">
                  <Save size={15} /> {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          )}

          {mode === "ver" && selected && (
            <>
              <button type="button" onClick={() => setMode("lista")} className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 mb-6">
                <ArrowLeft size={15} /> Volver
              </button>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 text-[14px] space-y-3">
                <p><span className="text-slate-400">Fecha:</span> {fmt(selected.fecha)}</p>
                <p><span className="text-slate-400">Plaga:</span> {selected.plaga === "ave" ? "Ave" : "Roedor"}</p>
                <p><span className="text-slate-400">Área:</span> {selected.area}</p>
                <p><span className="text-slate-400">Zona:</span> {selected.zona || "—"}</p>
                <p><span className="text-slate-400">Muertos / Vivos:</span> {selected.muertos} / {selected.vivos}</p>
                <p><span className="text-slate-400">Obs:</span> {selected.observaciones || "—"}</p>
                <p><span className="text-slate-400">Inspector:</span> {selected.inspector}</p>
              </div>
            </>
          )}
        </div>
        <footer className="py-3 text-center text-[11px] text-slate-400 border-t border-slate-100">Exportadora RomEx S.A. — QMS</footer>
      </main>
    </div>
  );
}

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
