"use client";

import { useEffect, useMemo, useState } from "react";
import MicroShell from "@/components/MicroShell";
import { ArrowLeft, Plus, Save, Trash2, Eye } from "lucide-react";

type RN = "R" | "NR" | "";

interface RegistroLimpieza {
  id: string;
  fecha: string;
  area: string;
  limpieza: RN;
  desinfeccion: RN;
  desinfectante: string;
  concentracion: string;
  observaciones: string;
  responsable: string;
  createdAt: string;
}

const AREAS = [
  "Almacén de grano 1",
  "Almacén de grano 2",
  "Almacén de empaque",
  "Almacén de insumos",
  "Almacén de productos terminados (APT)",
];

const STORAGE_KEY = "romex_limpieza_almacenes";

function load(): RegistroLimpieza[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(items: RegistroLimpieza[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function fmt(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function RNToggle({
  value,
  onChange,
  label,
}: {
  value: RN;
  onChange: (v: RN) => void;
  label: string;
}) {
  return (
    <div>
      <p className="text-[12px] font-medium text-slate-600 mb-1.5">{label}</p>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onChange("R")}
          className={`h-9 flex-1 rounded-lg text-[13px] font-semibold ${value === "R" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}
        >
          R
        </button>
        <button
          type="button"
          onClick={() => onChange("NR")}
          className={`h-9 flex-1 rounded-lg text-[13px] font-semibold ${value === "NR" ? "bg-red-500 text-white" : "bg-slate-100 text-slate-500"}`}
        >
          NR
        </button>
      </div>
      <p className="text-[11px] text-slate-400 mt-1">R = Realizado · NR = No realizado</p>
    </div>
  );
}

export default function AlmacenesPage() {
  const [items, setItems] = useState<RegistroLimpieza[]>([]);
  const [mode, setMode] = useState<"lista" | "nuevo" | "ver">("lista");
  const [selected, setSelected] = useState<RegistroLimpieza | null>(null);

  const [fecha, setFecha] = useState("");
  const [area, setArea] = useState(AREAS[0]);
  const [limpieza, setLimpieza] = useState<RN>("R");
  const [desinfeccion, setDesinfeccion] = useState<RN>("");
  const [desinfectante, setDesinfectante] = useState("");
  const [concentracion, setConcentracion] = useState("");
  const [obs, setObs] = useState("");
  const [responsable, setResponsable] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => setItems(load()), []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [items]
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha || !area) return;
    setSaving(true);
    try {
      const nuevo: RegistroLimpieza = {
        id: `${Date.now()}`,
        fecha,
        area,
        limpieza,
        desinfeccion,
        desinfectante: desinfectante.trim(),
        concentracion: concentracion.trim(),
        observaciones: obs.trim(),
        responsable: responsable.trim() || "—",
        createdAt: new Date().toISOString(),
      };
      const updated = [nuevo, ...items];
      setItems(updated);
      save(updated);
      setMode("lista");
      setFecha("");
      setObs("");
      setDesinfectante("");
      setConcentracion("");
      setDesinfeccion("");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este registro?")) return;
    const updated = items.filter((x) => x.id !== id);
    setItems(updated);
    save(updated);
  };

  return (
    <MicroShell title="Limpieza de almacenes" code="A-LDAMP-R-017">
      {mode === "lista" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[22px] font-semibold text-slate-800 mb-1">Limpieza de almacenes</h1>
              <p className="text-[13.5px] text-slate-500">
                Control diario de limpieza y desinfección · R / NR
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMode("nuevo")}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-medium"
            >
              <Plus size={16} /> Nuevo registro
            </button>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500 text-[14px]">
              Sin registros de limpieza aún
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((r) => (
                <div key={r.id} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-slate-800">
                      {fmt(r.fecha)} · {r.area}
                    </p>
                    <p className="text-[13px] text-slate-500">
                      Limpieza: {r.limpieza || "—"}
                      {r.desinfeccion ? ` · Desinfección: ${r.desinfeccion}` : ""}
                      {r.desinfectante ? ` · ${r.desinfectante}` : ""}
                      {r.concentracion ? ` ${r.concentracion}` : ""}
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
        <form onSubmit={handleSave} className="max-w-xl">
          <button type="button" onClick={() => setMode("lista")} className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 mb-6">
            <ArrowLeft size={15} /> Volver
          </button>
          <h1 className="text-[20px] font-semibold text-slate-800 mb-6">Nuevo registro diario</h1>

          <div className="space-y-4 mb-6">
            <Field label="Fecha">
              <input required type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Área / almacén">
              <select value={area} onChange={(e) => setArea(e.target.value)} className={inputClass}>
                {AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <RNToggle value={limpieza} onChange={setLimpieza} label="Limpieza" />
              <RNToggle value={desinfeccion} onChange={setDesinfeccion} label="Desinfección" />
            </div>
            <Field label="Desinfectante usado">
              <input
                value={desinfectante}
                onChange={(e) => setDesinfectante(e.target.value)}
                placeholder="agua clorada"
                className={inputClass}
              />
            </Field>
            <Field label="Concentración">
              <input
                value={concentracion}
                onChange={(e) => setConcentracion(e.target.value)}
                placeholder="30 ppm / 50 ppm"
                className={inputClass}
              />
            </Field>
            <Field label="Observaciones">
              <input
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="grano, yute, polvo, rafia..."
                className={inputClass}
              />
            </Field>
            <Field label="Responsable">
              <input value={responsable} onChange={(e) => setResponsable(e.target.value)} placeholder="Nombre" className={inputClass} />
            </Field>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setMode("lista")} className="h-11 px-5 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600">Cancelar</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-violet-600 text-white text-[14px] font-medium disabled:opacity-60">
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-[14px] space-y-3 max-w-lg">
            <p><span className="text-slate-400">Fecha:</span> {fmt(selected.fecha)}</p>
            <p><span className="text-slate-400">Área:</span> {selected.area}</p>
            <p><span className="text-slate-400">Limpieza:</span> {selected.limpieza || "—"}</p>
            <p><span className="text-slate-400">Desinfección:</span> {selected.desinfeccion || "—"}</p>
            <p><span className="text-slate-400">Desinfectante:</span> {selected.desinfectante || "—"} {selected.concentracion}</p>
            <p><span className="text-slate-400">Obs:</span> {selected.observaciones || "—"}</p>
            <p><span className="text-slate-400">Responsable:</span> {selected.responsable}</p>
          </div>
        </>
      )}
    </MicroShell>
  );
}
