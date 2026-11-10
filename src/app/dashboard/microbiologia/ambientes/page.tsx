"use client";

import { useEffect, useMemo, useState } from "react";
import MicroShell from "@/components/MicroShell";
import { ArrowLeft, Plus, Save, Trash2, Eye, Thermometer } from "lucide-react";

interface Lectura {
  area: string;
  punto: string;
  hora: string;
  temperatura: string;
  tempMax: string;
  tempMin: string;
  humedad: string;
  hrMax: string;
  hrMin: string;
  obs: string;
}

interface RegistroAmb {
  id: string;
  fecha: string;
  inspector: string;
  lecturas: Lectura[];
  createdAt: string;
}

/** Áreas según CONTROL DE AMBIENTE ZORKA.xlsx */
const AREAS_DEFAULT: {
  area: string;
  punto: string;
  tMin: string;
  tMax: string;
  hrMin: string;
  hrMax: string;
}[] = [
  {
    area: "Almacén de productos terminados",
    punto: "Punto 1",
    tMin: "18",
    tMax: "32",
    hrMin: "50",
    hrMax: "80",
  },
  {
    area: "Laboratorio de microbiología",
    punto: "Ambiente general",
    tMin: "18",
    tMax: "30",
    hrMin: "40",
    hrMax: "70",
  },
  {
    area: "Cabina de siembra",
    punto: "Interior cabina",
    tMin: "18",
    tMax: "28",
    hrMin: "40",
    hrMax: "70",
  },
  {
    area: "Refrigeradora",
    punto: "Interior",
    tMin: "2",
    tMax: "8",
    hrMin: "—",
    hrMax: "—",
  },
  {
    area: "Incubadora",
    punto: "Interior",
    tMin: "35",
    tMax: "37",
    hrMin: "—",
    hrMax: "—",
  },
];

const STORAGE_KEY = "romex_ambientes";

function load(): RegistroAmb[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(items: RegistroAmb[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function fmt(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function emptyLecturas(): Lectura[] {
  return AREAS_DEFAULT.map((a) => ({
    area: a.area,
    punto: a.punto,
    hora: "07:30",
    temperatura: "",
    tempMax: a.tMax,
    tempMin: a.tMin,
    humedad: "",
    hrMax: a.hrMax,
    hrMin: a.hrMin,
    obs: "",
  }));
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

export default function AmbientesPage() {
  const [items, setItems] = useState<RegistroAmb[]>([]);
  const [mode, setMode] = useState<"lista" | "nuevo" | "ver">("lista");
  const [selected, setSelected] = useState<RegistroAmb | null>(null);
  const [fecha, setFecha] = useState("");
  const [inspector, setInspector] = useState("");
  const [lecturas, setLecturas] = useState<Lectura[]>(emptyLecturas);
  const [saving, setSaving] = useState(false);

  useEffect(() => setItems(load()), []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [items]
  );

  const updateL = (i: number, field: keyof Lectura, value: string) => {
    setLecturas((prev) => {
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
      const nuevo: RegistroAmb = {
        id: `${Date.now()}`,
        fecha,
        inspector: inspector.trim() || "—",
        lecturas,
        createdAt: new Date().toISOString(),
      };
      const updated = [nuevo, ...items];
      setItems(updated);
      save(updated);
      setMode("lista");
      setFecha("");
      setInspector("");
      setLecturas(emptyLecturas());
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
    <MicroShell title="Control de ambientes" code="LM-IP-020">
      {mode === "lista" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[22px] font-semibold text-slate-800 tracking-tight mb-1">
                Control de ambientes
              </h1>
              <p className="text-[13.5px] text-slate-500">
                Temperatura y humedad · 1 vez al día · rangos según área
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMode("nuevo")}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-medium"
            >
              <Plus size={16} /> Nueva lectura
            </button>
          </div>

          {sorted.length === 0 ? (
            <div className="flex flex-col items-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
              <p className="text-[14px] font-medium text-slate-700 mb-1">Sin lecturas aún</p>
              <p className="text-[13px] text-slate-400 mb-5">Registra la primera toma del día</p>
              <button
                type="button"
                onClick={() => setMode("nuevo")}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-violet-600 text-white text-[13.5px] font-medium"
              >
                <Plus size={15} /> Nueva lectura
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-slate-800">{fmt(r.fecha)}</p>
                    <p className="text-[13px] text-slate-500">
                      {r.inspector} · {r.lecturas.length} punto(s)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(r);
                      setMode("ver");
                    }}
                    className="p-2 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"
                  >
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
          <button
            type="button"
            onClick={() => setMode("lista")}
            className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-800 mb-6"
          >
            <ArrowLeft size={15} /> Volver al listado
          </button>
          <h1 className="text-[20px] font-semibold text-slate-800 mb-6">Nueva lectura diaria</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Field label="Fecha">
              <input
                required
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Inspector / V°B°">
              <input
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
                placeholder="Nereyda"
                className={inputClass}
              />
            </Field>
          </div>
          <div className="space-y-4 mb-8">
            {lecturas.map((l, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Thermometer size={16} className="text-orange-500" />
                  <div>
                    <p className="text-[14px] font-semibold text-slate-800">{l.area}</p>
                    <p className="text-[12px] text-slate-500">
                      {l.punto}
                      {l.tempMin !== "—" && (
                        <> · Rango T° {l.tempMin}–{l.tempMax}°C</>
                      )}
                      {l.hrMin !== "—" && (
                        <> · HR {l.hrMin}–{l.hrMax}%</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Hora">
                    <input
                      type="time"
                      value={l.hora}
                      onChange={(e) => updateL(i, "hora", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="T° (°C)">
                    <input
                      value={l.temperatura}
                      onChange={(e) => updateL(i, "temperatura", e.target.value)}
                      placeholder="30.2"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="% HR">
                    <input
                      value={l.humedad}
                      onChange={(e) => updateL(i, "humedad", e.target.value)}
                      placeholder={l.hrMin === "—" ? "N/A" : "54"}
                      disabled={l.hrMin === "—"}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Observaciones">
                    <input
                      value={l.obs}
                      onChange={(e) => updateL(i, "obs", e.target.value)}
                      placeholder="—"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode("lista")}
              className="h-11 px-5 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-medium disabled:opacity-60"
            >
              <Save size={15} /> {saving ? "Guardando..." : "Guardar"}
            </button>
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
          <h1 className="text-[20px] font-semibold text-slate-800 mb-1">{fmt(selected.fecha)}</h1>
          <p className="text-[13.5px] text-slate-500 mb-6">Inspector: {selected.inspector}</p>
          <div className="space-y-3">
            {selected.lecturas.map((l, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-[13.5px]">
                <p className="font-semibold text-slate-800">
                  {l.area} · {l.punto}
                </p>
                <p className="text-slate-500 mt-1">Hora {l.hora || "—"}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-slate-700">
                  <span>
                    T° <strong>{l.temperatura || "—"}</strong> °C
                  </span>
                  {l.hrMin !== "—" && (
                    <span>
                      HR <strong>{l.humedad || "—"}</strong> %
                    </span>
                  )}
                  {l.obs && <span className="text-slate-500">{l.obs}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </MicroShell>
  );
}
