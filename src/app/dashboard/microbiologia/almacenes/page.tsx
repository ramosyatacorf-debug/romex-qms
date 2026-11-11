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
import { ArrowLeft, Plus, Save, Warehouse } from "lucide-react";

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
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => onChange("R")}
          className={`h-10 flex-1 rounded-xl text-[13px] font-semibold transition-colors ${
            value === "R"
              ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
              : "bg-slate-100 text-slate-500 hover:bg-slate-150"
          }`}
        >
          R
        </button>
        <button
          type="button"
          onClick={() => onChange("NR")}
          className={`h-10 flex-1 rounded-xl text-[13px] font-semibold transition-colors ${
            value === "NR"
              ? "bg-red-500 text-white shadow-sm shadow-red-500/20"
              : "bg-slate-100 text-slate-500 hover:bg-slate-150"
          }`}
        >
          NR
        </button>
      </div>
      <p className="text-[11px] text-slate-400 mt-1.5">R = Realizado · NR = No realizado</p>
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

  const resetForm = () => {
    setFecha("");
    setArea(AREAS[0]);
    setLimpieza("R");
    setDesinfeccion("");
    setDesinfectante("");
    setConcentracion("");
    setObs("");
    setResponsable("");
  };

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
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este registro?")) return;
    const updated = items.filter((x) => x.id !== id);
    setItems(updated);
    save(updated);
    if (selected?.id === id) {
      setSelected(null);
      setMode("lista");
    }
  };

  return (
    <MicroShell title="Limpieza de almacenes" code="A-LDAMP-R-017">
      {mode === "lista" && (
        <>
          <PageHeader
            title="Limpieza de almacenes"
            subtitle="Control diario de limpieza y desinfección · R / NR"
            action={
              <PrimaryButton onClick={() => { resetForm(); setMode("nuevo"); }}>
                <Plus size={16} /> Nuevo registro
              </PrimaryButton>
            }
          />

          {sorted.length === 0 ? (
            <EmptyState
              icon={Warehouse}
              title="Sin registros de limpieza"
              description="Registra la limpieza y desinfección diaria de cada almacén."
              action={
                <PrimaryButton onClick={() => setMode("nuevo")} className="h-10 px-4 text-[13.5px]">
                  <Plus size={15} /> Nuevo registro
                </PrimaryButton>
              }
            />
          ) : (
            <div className="space-y-2.5">
              {sorted.map((r) => (
                <ListRow
                  key={r.id}
                  icon={Warehouse}
                  title={`${fmt(r.fecha)} · ${r.area}`}
                  subtitle={`Limpieza ${r.limpieza || "—"}${r.desinfeccion ? ` · Desinf. ${r.desinfeccion}` : ""}${r.desinfectante ? ` · ${r.desinfectante}` : ""}${r.concentracion ? ` ${r.concentracion}` : ""}`}
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
          <h1 className="text-[20px] font-semibold text-slate-900 mb-6">Nuevo registro diario</h1>

          <div className="space-y-4 mb-8 p-5 bg-white border border-slate-200 rounded-2xl">
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
              <input
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                placeholder="Nombre"
                className={inputClass}
              />
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
            onClick={() => {
              setSelected(null);
              setMode("lista");
            }}
            className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-800 mb-6"
          >
            <ArrowLeft size={15} /> Volver al listado
          </button>
          <div className="max-w-lg bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Fecha</p>
              <p className="text-[15px] font-semibold text-slate-900">{fmt(selected.fecha)}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Área</p>
              <p className="text-[14px] text-slate-800">{selected.area}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Limpieza</p>
                <span className={`inline-flex h-7 px-2.5 items-center rounded-lg text-[13px] font-semibold ${
                  selected.limpieza === "R" ? "bg-emerald-50 text-emerald-700" : selected.limpieza === "NR" ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500"
                }`}>
                  {selected.limpieza || "—"}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Desinfección</p>
                <span className={`inline-flex h-7 px-2.5 items-center rounded-lg text-[13px] font-semibold ${
                  selected.desinfeccion === "R" ? "bg-emerald-50 text-emerald-700" : selected.desinfeccion === "NR" ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500"
                }`}>
                  {selected.desinfeccion || "—"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Desinfectante</p>
              <p className="text-[14px] text-slate-800">
                {selected.desinfectante || "—"}
                {selected.concentracion ? ` · ${selected.concentracion}` : ""}
              </p>
            </div>
            {selected.observaciones && (
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Observaciones</p>
                <p className="text-[14px] text-slate-700">{selected.observaciones}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Responsable</p>
              <p className="text-[14px] text-slate-800">{selected.responsable}</p>
            </div>
          </div>
        </>
      )}
    </MicroShell>
  );
}
