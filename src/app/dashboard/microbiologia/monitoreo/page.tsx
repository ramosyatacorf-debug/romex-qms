"use client";

import { useEffect, useMemo, useState } from "react";
import MicroShell from "@/components/MicroShell";
import { ArrowLeft, Plus, Save, Trash2, Eye } from "lucide-react";

interface PuntoMonitoreo {
  codigo: string;
  area: string;
  obsMuestreo: string;
  rtamv: string;
  mohos: string;
  levaduras: string;
}

interface RegistroMonitoreo {
  id: string;
  fecha: string;
  analista: string;
  puntos: PuntoMonitoreo[];
  createdAt: string;
}

/** Puntos según monitoreo zorka.xlsx */
const PUNTOS_BASE: { codigo: string; area: string }[] = [
  { codigo: "001-A", area: "Almacén de grano 1" },
  { codigo: "002-A", area: "Limpiadora - Despedradora" },
  { codigo: "003-A", area: "Secadora" },
  { codigo: "004-A", area: "Tostador" },
  { codigo: "004-B", area: "Descascarilladora" },
  { codigo: "005-A", area: "Molinos Refinadores - Tamizado" },
  { codigo: "006-A", area: "Tanques de Homogenizado" },
  { codigo: "007-A", area: "Esterilizado" },
  { codigo: "008-A", area: "Almacén de mantenimiento" },
  { codigo: "009-A", area: "Prensa" },
  { codigo: "010-A", area: "Temperado" },
  { codigo: "011-A", area: "Sala de trozado de Torta" },
  { codigo: "012-A", area: "Sala de Molienda de torta" },
  { codigo: "015-A", area: "Sala de alcalinizado de torta" },
  { codigo: "016-A", area: "Almacén de productos terminados" },
  { codigo: "017-A", area: "Laboratorio de microbiología" },
  { codigo: "018-A", area: "Laboratorio de fisicoquímico" },
  { codigo: "019-A", area: "Aduana de higiene" },
  { codigo: "020-A", area: "Baño de varones" },
  { codigo: "021-A", area: "Baño de damas" },
  { codigo: "022-A", area: "Almacén Empaque" },
  { codigo: "023-A", area: "Almacén de Insumos" },
  { codigo: "024-A", area: "Comedor" },
];

const STORAGE_KEY = "romex_monitoreo_ambiental";

function emptyPuntos(): PuntoMonitoreo[] {
  return PUNTOS_BASE.map((p) => ({
    ...p,
    obsMuestreo: "",
    rtamv: "",
    mohos: "",
    levaduras: "",
  }));
}

function load(): RegistroMonitoreo[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(items: RegistroMonitoreo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function fmt(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function totalUfc(p: PuntoMonitoreo) {
  const a = Number(p.rtamv) || 0;
  const b = Number(p.mohos) || 0;
  const c = Number(p.levaduras) || 0;
  if (!p.rtamv && !p.mohos && !p.levaduras) return null;
  return a + b + c;
}

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

const inputSm =
  "w-full h-9 px-2 rounded-lg border border-slate-200 text-[13px] text-slate-800 outline-none focus:border-violet-500";

export default function MonitoreoPage() {
  const [items, setItems] = useState<RegistroMonitoreo[]>([]);
  const [mode, setMode] = useState<"lista" | "nuevo" | "ver">("lista");
  const [selected, setSelected] = useState<RegistroMonitoreo | null>(null);
  const [fecha, setFecha] = useState("");
  const [analista, setAnalista] = useState("");
  const [puntos, setPuntos] = useState<PuntoMonitoreo[]>(emptyPuntos);
  const [saving, setSaving] = useState(false);

  useEffect(() => setItems(load()), []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [items]
  );

  const update = (i: number, field: keyof PuntoMonitoreo, value: string) => {
    setPuntos((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha) return;
    setSaving(true);
    try {
      const nuevo: RegistroMonitoreo = {
        id: `${Date.now()}`,
        fecha,
        analista: analista.trim() || "—",
        puntos,
        createdAt: new Date().toISOString(),
      };
      const updated = [nuevo, ...items];
      setItems(updated);
      save(updated);
      setMode("lista");
      setFecha("");
      setAnalista("");
      setPuntos(emptyPuntos());
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este monitoreo?")) return;
    const updated = items.filter((x) => x.id !== id);
    setItems(updated);
    save(updated);
  };

  return (
    <MicroShell title="Monitoreo ambiental" code="LM-MM · Placas de ambiente">
      {mode === "lista" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[22px] font-semibold text-slate-800 mb-1">Monitoreo ambiental</h1>
              <p className="text-[13.5px] text-slate-500">
                Placas por área · RTAMV, mohos y levaduras (UFC)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMode("nuevo")}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-medium"
            >
              <Plus size={16} /> Nuevo muestreo
            </button>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500 text-[14px]">
              Sin monitoreos registrados
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((r) => (
                <div key={r.id} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-slate-800">{fmt(r.fecha)}</p>
                    <p className="text-[13px] text-slate-500">
                      {r.analista} · {r.puntos.length} puntos
                    </p>
                  </div>
                  <button type="button" onClick={() => { setSelected(r); setMode("ver"); }} className="p-2 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600">
                    <Eye size={16} />
                  </button>
                  <button type="button" onClick={() => handleDelete(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === "nuevo" && (
        <form onSubmit={handleSave}>
          <button type="button" onClick={() => setMode("lista")} className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 mb-6">
            <ArrowLeft size={15} /> Volver
          </button>
          <h1 className="text-[20px] font-semibold text-slate-800 mb-1">Nuevo muestreo ambiental</h1>
          <p className="text-[13.5px] text-slate-500 mb-6">Completa RTAMV, mohos y levaduras por punto</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1">Fecha de muestreo</label>
              <input required type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1">Analista responsable</label>
              <input value={analista} onChange={(e) => setAnalista(e.target.value)} placeholder="Nereyda Huachua" className={inputClass} />
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {puntos.map((p, i) => {
              const tot = totalUfc(p);
              return (
                <div key={p.codigo} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex flex-wrap items-baseline gap-2 mb-3">
                    <span className="text-[12px] font-semibold text-violet-600">{p.codigo}</span>
                    <span className="text-[13.5px] font-medium text-slate-800">{p.area}</span>
                    {tot !== null && (
                      <span className="text-[12px] text-slate-400 ml-auto">Total {tot} UFC</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-500">Obs. muestreo</label>
                      <input value={p.obsMuestreo} onChange={(e) => update(i, "obsMuestreo", e.target.value)} placeholder="sobre mesa..." className={inputSm} />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">RTAMV</label>
                      <input value={p.rtamv} onChange={(e) => update(i, "rtamv", e.target.value)} placeholder="0" className={inputSm} />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">Mohos</label>
                      <input value={p.mohos} onChange={(e) => update(i, "mohos", e.target.value)} placeholder="0" className={inputSm} />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">Levaduras</label>
                      <input value={p.levaduras} onChange={(e) => update(i, "levaduras", e.target.value)} placeholder="0" className={inputSm} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setMode("lista")} className="h-11 px-5 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600">Cancelar</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-violet-600 text-white text-[14px] font-medium disabled:opacity-60">
              <Save size={15} /> {saving ? "Guardando..." : "Guardar muestreo"}
            </button>
          </div>
        </form>
      )}

      {mode === "ver" && selected && (
        <>
          <button type="button" onClick={() => setMode("lista")} className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 mb-6">
            <ArrowLeft size={15} /> Volver
          </button>
          <h1 className="text-[20px] font-semibold text-slate-800 mb-1">{fmt(selected.fecha)}</h1>
          <p className="text-[13.5px] text-slate-500 mb-6">Analista: {selected.analista}</p>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <th className="px-3 py-2.5 font-medium">Código</th>
                    <th className="px-3 py-2.5 font-medium">Área</th>
                    <th className="px-3 py-2.5 font-medium">RTAMV</th>
                    <th className="px-3 py-2.5 font-medium">Mohos</th>
                    <th className="px-3 py-2.5 font-medium">Levaduras</th>
                    <th className="px-3 py-2.5 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.puntos.map((p) => (
                    <tr key={p.codigo} className="border-b border-slate-50 last:border-0">
                      <td className="px-3 py-2 text-violet-600 font-medium">{p.codigo}</td>
                      <td className="px-3 py-2 text-slate-700">{p.area}</td>
                      <td className="px-3 py-2">{p.rtamv || "—"}</td>
                      <td className="px-3 py-2">{p.mohos || "—"}</td>
                      <td className="px-3 py-2">{p.levaduras || "—"}</td>
                      <td className="px-3 py-2 font-medium">{totalUfc(p) ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </MicroShell>
  );
}
