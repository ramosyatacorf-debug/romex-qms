"use client";

import { useEffect, useMemo, useState } from "react";
import MicroShell from "@/components/MicroShell";
import {
  Field,
  PageHeader,
  EmptyState,
  ListRow,
  PrimaryButton,
  GhostButton,
  inputClass,
} from "@/components/ui";
import { ArrowLeft, Plus, Save, Bug } from "lucide-react";

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
  const [items, setItems] = useState<EventoPlaga[]>([]);
  const [mode, setMode] = useState<"lista" | "nuevo" | "ver">("lista");
  const [selected, setSelected] = useState<EventoPlaga | null>(null);
  const [fecha, setFecha] = useState("");
  const [area, setArea] = useState("");
  const [plaga, setPlaga] = useState<"ave" | "roedor">("ave");
  const [muertos, setMuertos] = useState("0");
  const [vivos, setVivos] = useState("1");
  const [zona, setZona] = useState("");
  const [obs, setObs] = useState("");
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
      setObs("");
      setMuertos("0");
      setVivos("1");
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

  const alertaAves = totalesMes.aves > 5;
  const alertaRoedores = totalesMes.roedores > 3;

  return (
    <MicroShell title="Control de plagas" code="LM-CP-R-004">
      {mode === "lista" && (
        <>
          <PageHeader
            title="Control de plagas"
            subtitle="Registro cada vez que se observe ave o roedor"
            action={
              <PrimaryButton onClick={() => setMode("nuevo")}>
                <Plus size={16} /> Registrar evento
              </PrimaryButton>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <div className={`bg-white border rounded-2xl p-4 ${alertaAves ? "border-amber-300" : "border-slate-200"}`}>
              <p className="text-[12px] text-slate-500 mb-1">Aves este mes</p>
              <p className="text-[26px] font-semibold text-slate-900 tracking-tight">{totalesMes.aves}</p>
              <p className={`text-[11.5px] mt-1 ${alertaAves ? "text-amber-700 font-medium" : "text-slate-400"}`}>
                Umbral: mayor a 5 requiere empresa tercera
              </p>
            </div>
            <div className={`bg-white border rounded-2xl p-4 ${alertaRoedores ? "border-amber-300" : "border-slate-200"}`}>
              <p className="text-[12px] text-slate-500 mb-1">Roedores este mes</p>
              <p className="text-[26px] font-semibold text-slate-900 tracking-tight">{totalesMes.roedores}</p>
              <p className={`text-[11.5px] mt-1 ${alertaRoedores ? "text-amber-700 font-medium" : "text-slate-400"}`}>
                Umbral: mayor a 3 requiere empresa tercera
              </p>
            </div>
          </div>

          {sorted.length === 0 ? (
            <EmptyState
              icon={Bug}
              title="Sin eventos registrados"
              description="Cuando observes aves o roedores, registra el avistamiento aquí."
              action={
                <PrimaryButton onClick={() => setMode("nuevo")} className="h-10 px-4 text-[13.5px]">
                  <Plus size={15} /> Registrar evento
                </PrimaryButton>
              }
            />
          ) : (
            <div className="space-y-2.5">
              {sorted.map((r) => (
                <ListRow
                  key={r.id}
                  icon={Bug}
                  title={`${fmt(r.fecha)} · ${r.plaga === "ave" ? "Ave" : "Roedor"} · total ${r.muertos + r.vivos}`}
                  subtitle={`${r.area}${r.zona ? ` · ${r.zona}` : ""}`}
                  onView={() => {
                    setSelected(r);
                    setMode("ver");
                  }}
                  onDelete={() => handleDelete(r.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {mode === "nuevo" && (
        <form onSubmit={handleSave} className="max-w-xl">
          <button
            type="button"
            onClick={() => setMode("lista")}
            className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-800 mb-6"
          >
            <ArrowLeft size={15} /> Volver al listado
          </button>
          <h1 className="text-[20px] font-semibold text-slate-900 mb-6">Registrar avistamiento</h1>

          <div className="space-y-4 mb-8 p-5 bg-white border border-slate-200 rounded-2xl">
            <Field label="Fecha">
              <input required type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Área">
              <input
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Mantenimiento, patio de maniobras..."
                className={inputClass}
              />
            </Field>
            <Field label="Zona de ubicación">
              <input
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                placeholder="Frente al comedor, cercano al shiller..."
                className={inputClass}
              />
            </Field>
            <Field label="Plaga">
              <select value={plaga} onChange={(e) => setPlaga(e.target.value as "ave" | "roedor")} className={inputClass}>
                <option value="ave">Ave</option>
                <option value="roedor">Roedor</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Muertos">
                <input type="number" min={0} value={muertos} onChange={(e) => setMuertos(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Vivos">
                <input type="number" min={0} value={vivos} onChange={(e) => setVivos(e.target.value)} className={inputClass} />
              </Field>
            </div>
            <Field label="Observaciones">
              <input value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Detalle del avistamiento" className={inputClass} />
            </Field>
            <Field label="Inspector">
              <input value={inspector} onChange={(e) => setInspector(e.target.value)} placeholder="Nereyda" className={inputClass} />
            </Field>
          </div>

          <div className="flex gap-3">
            <GhostButton onClick={() => setMode("lista")}>Cancelar</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>
              <Save size={15} /> {saving ? "Guardando..." : "Guardar"}
            </PrimaryButton>
          </div>
        </form>
      )}

      {mode === "ver" && selected && (
        <>
          <button
            type="button"
            onClick={() => setMode("lista")}
            className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-800 mb-6"
          >
            <ArrowLeft size={15} /> Volver al listado
          </button>
          <div className="max-w-lg bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Fecha</p>
              <p className="text-[15px] font-semibold text-slate-900">{fmt(selected.fecha)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Plaga</p>
                <p className="text-[14px] text-slate-800">{selected.plaga === "ave" ? "Ave" : "Roedor"}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Muertos / Vivos</p>
                <p className="text-[14px] text-slate-800">{selected.muertos} / {selected.vivos}</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Área</p>
              <p className="text-[14px] text-slate-800">{selected.area}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Zona</p>
              <p className="text-[14px] text-slate-800">{selected.zona || "—"}</p>
            </div>
            {selected.observaciones && (
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Observaciones</p>
                <p className="text-[14px] text-slate-700">{selected.observaciones}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Inspector</p>
              <p className="text-[14px] text-slate-800">{selected.inspector}</p>
            </div>
          </div>
        </>
      )}
    </MicroShell>
  );
}
