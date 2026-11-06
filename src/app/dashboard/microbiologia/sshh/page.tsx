"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ChevronRight, ArrowLeft, Plus, Save, Trash2, Eye } from "lucide-react";

type Estado = "C" | "N" | "";

interface ItemCheck {
  id: string;
  label: string;
  estado: Estado;
}

interface RegistroSSHH {
  id: string;
  fecha: string;
  hora: string;
  tipo: "varones" | "damas";
  personalLimpieza: string;
  inspector: string;
  items: ItemCheck[];
  observaciones: string;
  createdAt: string;
}

const ITEMS_VARONES = [
  "Ducha 1", "Ducha 2", "Ducha 3",
  "Inodoro 1", "Inodoro 2", "Inodoro 3",
  "Lavadero 1", "Lavadero 2", "Lavadero 3",
  "Urinario 1", "Urinario 2",
  "Pisos", "Patio", "Tacho de basura",
  "Jabón líquido", "Papel toalla", "Desinfectante de manos", "Utensilios de limpieza",
];

const ITEMS_DAMAS = [
  "Ducha 1", "Ducha 2", "Ducha 3",
  "Inodoro 1", "Inodoro 2",
  "Lavadero 1", "Lavadero 2", "Lavadero 3",
  "Pisos", "Papelera 1", "Papelera 2",
  "Jabón líquido", "Desinfectante de manos", "Utensilios de limpieza",
];

const STORAGE_KEY = "romex_sshh";

function load(): RegistroSSHH[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(items: RegistroSSHH[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function fmt(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function makeItems(labels: string[]): ItemCheck[] {
  return labels.map((label, i) => ({ id: String(i), label, estado: "C" as Estado }));
}

export default function SshhPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState<RegistroSSHH[]>([]);
  const [mode, setMode] = useState<"lista" | "nuevo" | "ver">("lista");
  const [selected, setSelected] = useState<RegistroSSHH | null>(null);

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("08:00");
  const [tipo, setTipo] = useState<"varones" | "damas">("varones");
  const [personal, setPersonal] = useState("");
  const [inspector, setInspector] = useState("");
  const [checks, setChecks] = useState<ItemCheck[]>(() => makeItems(ITEMS_VARONES));
  const [obs, setObs] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => setItems(load()), []);

  useEffect(() => {
    setChecks(makeItems(tipo === "varones" ? ITEMS_VARONES : ITEMS_DAMAS));
  }, [tipo]);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.hora.localeCompare(a.hora)),
    [items]
  );

  const setEstado = (id: string, estado: Estado) => {
    setChecks((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha) return;
    setSaving(true);
    try {
      const nuevo: RegistroSSHH = {
        id: `${Date.now()}`,
        fecha,
        hora,
        tipo,
        personalLimpieza: personal.trim() || "—",
        inspector: inspector.trim() || "—",
        items: checks,
        observaciones: obs,
        createdAt: new Date().toISOString(),
      };
      const updated = [nuevo, ...items];
      setItems(updated);
      save(updated);
      setMode("lista");
      setFecha("");
      setObs("");
      setPersonal("");
      setInspector("");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar inspección?")) return;
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
            <span className="text-slate-600">SS.HH.</span>
          </div>

          {mode === "lista" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                  <p className="text-[11px] font-medium text-slate-400 mb-1">LM-IP-R-003</p>
                  <h1 className="text-[22px] font-semibold text-slate-800 mb-1">Inspección SS.HH.</h1>
                  <p className="text-[13.5px] text-slate-500">Limpieza y desinfección · 1 vez al día · C = Conforme · N = No conforme</p>
                </div>
                <button onClick={() => setMode("nuevo")} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium">
                  <Plus size={16} /> Nueva inspección
                </button>
              </div>
              {sorted.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500 text-[14px]">Sin inspecciones aún</div>
              ) : (
                <div className="space-y-3">
                  {sorted.map((r) => {
                    const nc = r.items.filter((i) => i.estado === "N").length;
                    return (
                      <div key={r.id} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl">
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-semibold text-slate-800">
                            {fmt(r.fecha)} · {r.hora} · {r.tipo === "varones" ? "Varones" : "Damas"}
                          </p>
                          <p className="text-[13px] text-slate-500">
                            {r.inspector}
                            {nc > 0 ? ` · ${nc} no conforme(s)` : " · Todo conforme"}
                          </p>
                        </div>
                        <button onClick={() => { setSelected(r); setMode("ver"); }} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Eye size={16} /></button>
                        <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {mode === "nuevo" && (
            <form onSubmit={handleSave}>
              <button type="button" onClick={() => setMode("lista")} className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 mb-6">
                <ArrowLeft size={15} /> Volver
              </button>
              <h1 className="text-[20px] font-semibold text-slate-800 mb-6">Nueva inspección</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Field label="Fecha"><input required type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} /></Field>
                <Field label="Hora"><input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={inputClass} /></Field>
                <Field label="SS.HH.">
                  <select value={tipo} onChange={(e) => setTipo(e.target.value as "varones" | "damas")} className={inputClass}>
                    <option value="varones">Varones</option>
                    <option value="damas">Damas</option>
                  </select>
                </Field>
                <Field label="Personal de limpieza"><input value={personal} onChange={(e) => setPersonal(e.target.value)} placeholder="José / Luzmila" className={inputClass} /></Field>
                <Field label="Inspector"><input value={inspector} onChange={(e) => setInspector(e.target.value)} placeholder="Nereyda" className={inputClass} /></Field>
              </div>

              <p className="text-[13px] font-medium text-slate-500 mb-3 mt-2">Checklist (toca C o N)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {checks.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
                    <span className="text-[13.5px] text-slate-700">{c.label}</span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => setEstado(c.id, "C")} className={`h-8 w-9 rounded-lg text-[12px] font-semibold ${c.estado === "C" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}>C</button>
                      <button type="button" onClick={() => setEstado(c.id, "N")} className={`h-8 w-9 rounded-lg text-[12px] font-semibold ${c.estado === "N" ? "bg-red-500 text-white" : "bg-slate-100 text-slate-500"}`}>N</button>
                    </div>
                  </div>
                ))}
              </div>

              <Field label="Observaciones">
                <input value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Pisos con licor, papelera sin bolsas..." className={inputClass + " mb-6"} />
              </Field>

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
              <h1 className="text-[20px] font-semibold text-slate-800 mb-1">
                {fmt(selected.fecha)} · {selected.tipo === "varones" ? "Varones" : "Damas"}
              </h1>
              <p className="text-[13.5px] text-slate-500 mb-6">
                {selected.hora} · Limpieza: {selected.personalLimpieza} · Inspector: {selected.inspector}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {selected.items.map((c) => (
                  <div key={c.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-[13.5px]">
                    <span className="text-slate-700">{c.label}</span>
                    <span className={`font-semibold ${c.estado === "N" ? "text-red-600" : "text-emerald-600"}`}>{c.estado || "—"}</span>
                  </div>
                ))}
              </div>
              {selected.observaciones && (
                <p className="text-[13.5px] text-slate-600 bg-white border border-slate-200 rounded-xl p-4">{selected.observaciones}</p>
              )}
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
