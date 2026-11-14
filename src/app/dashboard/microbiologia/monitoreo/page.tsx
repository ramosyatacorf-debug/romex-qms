"use client";

import { useEffect, useMemo, useState } from "react";
import MicroShell from "@/components/MicroShell";
import { ArrowLeft, Plus, Save, Trash2, Eye, Activity, CheckCircle2 } from "lucide-react";
import { safeGetJSON, safeSetJSON } from "@/lib/safe-storage";

interface PuntoMonitoreo {
  codigo: string;
  area: string;
  grupo: string;
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

const PUNTOS_BASE: { codigo: string; area: string; grupo: string }[] = [
  { codigo: "001-A", area: "Almacén de grano 1", grupo: "Almacenes" },
  { codigo: "008-A", area: "Almacén de mantenimiento", grupo: "Almacenes" },
  { codigo: "016-A", area: "Almacén de productos terminados", grupo: "Almacenes" },
  { codigo: "022-A", area: "Almacén Empaque", grupo: "Almacenes" },
  { codigo: "023-A", area: "Almacén de Insumos", grupo: "Almacenes" },
  { codigo: "002-A", area: "Limpiadora - Despedradora", grupo: "Proceso de grano" },
  { codigo: "003-A", area: "Secadora", grupo: "Proceso de grano" },
  { codigo: "004-A", area: "Tostador", grupo: "Proceso de grano" },
  { codigo: "004-B", area: "Descascarilladora", grupo: "Proceso de grano" },
  { codigo: "005-A", area: "Molinos Refinadores - Tamizado", grupo: "Proceso de grano" },
  { codigo: "006-A", area: "Tanques de Homogenizado", grupo: "Proceso de producto" },
  { codigo: "007-A", area: "Esterilizado", grupo: "Proceso de producto" },
  { codigo: "009-A", area: "Prensa", grupo: "Proceso de producto" },
  { codigo: "010-A", area: "Temperado", grupo: "Proceso de producto" },
  { codigo: "011-A", area: "Sala de trozado de Torta", grupo: "Proceso de producto" },
  { codigo: "012-A", area: "Sala de Molienda de torta", grupo: "Proceso de producto" },
  { codigo: "015-A", area: "Sala de alcalinizado de torta", grupo: "Proceso de producto" },
  { codigo: "017-A", area: "Laboratorio de microbiología", grupo: "Laboratorios" },
  { codigo: "018-A", area: "Laboratorio de fisicoquímico", grupo: "Laboratorios" },
  { codigo: "019-A", area: "Aduana de higiene", grupo: "Higiene y servicios" },
  { codigo: "020-A", area: "Baño de varones", grupo: "Higiene y servicios" },
  { codigo: "021-A", area: "Baño de damas", grupo: "Higiene y servicios" },
  { codigo: "024-A", area: "Comedor", grupo: "Higiene y servicios" },
];

const GRUPOS_ORDEN = [
  "Almacenes",
  "Proceso de grano",
  "Proceso de producto",
  "Laboratorios",
  "Higiene y servicios",
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
  return safeGetJSON<RegistroMonitoreo[]>(STORAGE_KEY, []);
}

function save(items: RegistroMonitoreo[]): { ok: boolean; error?: string } {
  return safeSetJSON(STORAGE_KEY, items);
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

function puntoCompleto(p: PuntoMonitoreo) {
  return Boolean(p.rtamv || p.mohos || p.levaduras);
}

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 bg-white";

const inputSm =
  "w-full h-9 px-2.5 rounded-lg border border-slate-200 text-[13px] text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 bg-white";

export default function MonitoreoPage() {
  const [items, setItems] = useState<RegistroMonitoreo[]>([]);
  const [mode, setMode] = useState<"lista" | "nuevo" | "ver">("lista");
  const [selected, setSelected] = useState<RegistroMonitoreo | null>(null);
  const [fecha, setFecha] = useState("");
  const [analista, setAnalista] = useState("");
  const [puntos, setPuntos] = useState<PuntoMonitoreo[]>(emptyPuntos);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => setItems(load()), []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [items]
  );

  const completados = useMemo(() => puntos.filter(puntoCompleto).length, [puntos]);

  const puntosPorGrupo = useMemo(() => {
    const map = new Map<string, { index: number; p: PuntoMonitoreo }[]>();
    puntos.forEach((p, index) => {
      const list = map.get(p.grupo) || [];
      list.push({ index, p });
      map.set(p.grupo, list);
    });
    return GRUPOS_ORDEN.map((g) => ({ grupo: g, items: map.get(g) || [] })).filter(
      (g) => g.items.length > 0
    );
  }, [puntos]);

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
    setSaveError("");
    try {
      const nuevo: RegistroMonitoreo = {
        id: `${Date.now()}`,
        fecha,
        analista: analista.trim() || "—",
        puntos,
        createdAt: new Date().toISOString(),
      };
      const updated = [nuevo, ...items];
      const result = save(updated);
      if (!result.ok) {
        setSaveError(result.error || "No se pudo guardar");
        return;
      }
      setItems(updated);
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
    const result = save(updated);
    if (!result.ok) {
      alert(result.error || "No se pudo eliminar");
      return;
    }
    setItems(updated);
    if (selected?.id === id) {
      setSelected(null);
      setMode("lista");
    }
  };

  return (
    <MicroShell title="Monitoreo ambiental" code="LM-MM · Placas de ambiente">
      {mode === "lista" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight mb-1">
                Monitoreo ambiental
              </h1>
              <p className="text-[13.5px] text-slate-500">
                Placas por área · RTAMV, mohos y levaduras (UFC)
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPuntos(emptyPuntos());
                setFecha("");
                setAnalista("");
                setMode("nuevo");
              }}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-medium shadow-sm shadow-violet-600/20"
            >
              <Plus size={16} /> Nuevo muestreo
            </button>
          </div>

          {sorted.length === 0 ? (
            <div className="flex flex-col items-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center mb-4">
                <Activity size={22} />
              </div>
              <p className="text-[14px] font-medium text-slate-800 mb-1">Sin monitoreos registrados</p>
              <p className="text-[13px] text-slate-400 mb-5 text-center max-w-sm">
                Crea el primer muestreo ambiental con los 23 puntos de planta.
              </p>
              <button
                type="button"
                onClick={() => setMode("nuevo")}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-violet-600 text-white text-[13.5px] font-medium"
              >
                <Plus size={15} /> Nuevo muestreo
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((r) => {
                const filled = r.puntos.filter(puntoCompleto).length;
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                      <Activity size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-slate-900">{fmt(r.fecha)}</p>
                      <p className="text-[13px] text-slate-500 mt-0.5">
                        {r.analista} · {filled}/{r.puntos.length} puntos con dato
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(r);
                        setMode("ver");
                      }}
                      className="p-2 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600"
                      title="Ver"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {mode === "nuevo" && (
        <form onSubmit={handleSave}>
          <button
            type="button"
            onClick={() => setMode("lista")}
            className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-800 mb-6"
          >
            <ArrowLeft size={15} /> Volver al listado
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[20px] font-semibold text-slate-900 mb-1">Nuevo muestreo ambiental</h1>
              <p className="text-[13.5px] text-slate-500">
                Completa RTAMV, mohos y levaduras por punto de planta
              </p>
            </div>
            <div className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-white border border-slate-200 text-[12.5px] text-slate-600">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="font-medium text-slate-800">{completados}</span>
              <span>/ {puntos.length} puntos</span>
            </div>
          </div>

          {saveError && (
            <p className="mb-4 text-[13px] text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {saveError}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 bg-white border border-slate-200 rounded-2xl">
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Fecha de muestreo</label>
              <input
                required
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Analista responsable</label>
              <input
                value={analista}
                onChange={(e) => setAnalista(e.target.value)}
                placeholder="Nereyda Huachua"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-8 mb-10">
            {puntosPorGrupo.map(({ grupo, items: groupItems }) => (
              <section key={grupo}>
                <h2 className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {grupo}
                </h2>
                <div className="space-y-2.5">
                  {groupItems.map(({ index, p }) => {
                    const tot = totalUfc(p);
                    const ok = puntoCompleto(p);
                    return (
                      <div
                        key={p.codigo}
                        className={`bg-white border rounded-xl p-3.5 sm:p-4 transition-colors ${
                          ok ? "border-violet-100" : "border-slate-200"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
                          <span className="text-[12px] font-semibold text-violet-600">{p.codigo}</span>
                          <span className="text-[13.5px] font-medium text-slate-800">{p.area}</span>
                          {tot !== null && (
                            <span className="text-[12px] text-slate-400 sm:ml-auto">
                              Total {tot} UFC
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                          <div>
                            <label className="text-[11px] text-slate-500 mb-1 block">Obs. muestreo</label>
                            <input
                              value={p.obsMuestreo}
                              onChange={(e) => update(index, "obsMuestreo", e.target.value)}
                              placeholder="sobre mesa..."
                              className={inputSm}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 mb-1 block">RTAMV</label>
                            <input
                              value={p.rtamv}
                              onChange={(e) => update(index, "rtamv", e.target.value)}
                              placeholder="0"
                              inputMode="decimal"
                              className={inputSm}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 mb-1 block">Mohos</label>
                            <input
                              value={p.mohos}
                              onChange={(e) => update(index, "mohos", e.target.value)}
                              placeholder="0"
                              inputMode="decimal"
                              className={inputSm}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 mb-1 block">Levaduras</label>
                            <input
                              value={p.levaduras}
                              onChange={(e) => update(index, "levaduras", e.target.value)}
                              placeholder="0"
                              inputMode="decimal"
                              className={inputSm}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-[#f8fafc]/95 backdrop-blur border-t border-slate-200 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setMode("lista")}
              className="h-11 px-5 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !fecha}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-medium disabled:opacity-60 shadow-sm"
            >
              <Save size={15} /> {saving ? "Guardando..." : "Guardar muestreo"}
            </button>
            <span className="text-[12.5px] text-slate-400 self-center sm:ml-auto">
              {completados} de {puntos.length} puntos con resultado
            </span>
          </div>
        </form>
      )}

      {mode === "ver" && selected && (
        <>
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setMode("lista");
            }}
            className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-800 mb-6"
          >
            <ArrowLeft size={15} /> Volver al listado
          </button>
          <div className="mb-6">
            <h1 className="text-[20px] font-semibold text-slate-900">{fmt(selected.fecha)}</h1>
            <p className="text-[13.5px] text-slate-500 mt-1">
              Analista: {selected.analista} · {selected.puntos.filter(puntoCompleto).length}/
              {selected.puntos.length} puntos con dato
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <th className="px-4 py-3 font-medium">Código</th>
                    <th className="px-4 py-3 font-medium">Área</th>
                    <th className="px-4 py-3 font-medium">RTAMV</th>
                    <th className="px-4 py-3 font-medium">Mohos</th>
                    <th className="px-4 py-3 font-medium">Levaduras</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.puntos.map((p) => (
                    <tr key={p.codigo} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-2.5 text-violet-600 font-medium whitespace-nowrap">{p.codigo}</td>
                      <td className="px-4 py-2.5 text-slate-700">{p.area}</td>
                      <td className="px-4 py-2.5">{p.rtamv || "—"}</td>
                      <td className="px-4 py-2.5">{p.mohos || "—"}</td>
                      <td className="px-4 py-2.5">{p.levaduras || "—"}</td>
                      <td className="px-4 py-2.5 font-medium">{totalUfc(p) ?? "—"}</td>
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

