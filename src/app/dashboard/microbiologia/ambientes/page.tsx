"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ChevronRight, ArrowLeft, Plus, Save, Trash2, Eye, Thermometer } from "lucide-react";

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

const AREAS_DEFAULT: { area: string; punto: string; tMin: string; tMax: string; hrMin: string; hrMax: string }[] = [
  { area: "Almacén de productos terminados", punto: "Punto 1", tMin: "18", tMax: "32", hrMin: "50", hrMax: "80" },
  { area: "Cubículos de mohos", punto: "Punto 5", tMin: "18", tMax: "30", hrMin: "44", hrMax: "80" },
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

export default function AmbientesPage() {
  const [collapsed, setCollapsed] = useState(false);
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
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">
          <Breadcrumb current="Control de ambientes" />

          {mode === "lista" && (
            <>
              <Header
                code="LM-IP-020"
                title="Control de ambientes"
                subtitle="Temperatura y humedad relativa · 1 vez al día"
                onNew={() => setMode("nuevo")}
              />
              {sorted.length === 0 ? (
                <Empty onNew={() => setMode("nuevo")} />
              ) : (
                <div className="space-y-3">
                  {sorted.map((r) => (
                    <ListRow
                      key={r.id}
                      title={fmt(r.fecha)}
                      subtitle={`${r.inspector} · ${r.lecturas.length} punto(s)`}
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
            <form onSubmit={handleSave}>
              <Back onClick={() => setMode("lista")} />
              <h1 className="text-[20px] font-semibold text-slate-800 mb-6">Nueva lectura diaria</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Field label="Fecha">
                  <input required type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Inspector / V°B°">
                  <input value={inspector} onChange={(e) => setInspector(e.target.value)} placeholder="Nereyda" className={inputClass} />
                </Field>
              </div>
              <div className="space-y-4 mb-8">
                {lecturas.map((l, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Thermometer size={16} className="text-orange-500" />
                      <div>
                        <p className="text-[14px] font-semibold text-slate-800">{l.area}</p>
                        <p className="text-[12px] text-slate-500">{l.punto} · Rango T° {l.tempMin}–{l.tempMax}°C · HR {l.hrMin}–{l.hrMax}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Field label="Hora">
                        <input type="time" value={l.hora} onChange={(e) => updateL(i, "hora", e.target.value)} className={inputClass} />
                      </Field>
                      <Field label="T° (°C)">
                        <input value={l.temperatura} onChange={(e) => updateL(i, "temperatura", e.target.value)} placeholder="30.2" className={inputClass} />
                      </Field>
                      <Field label="% HR">
                        <input value={l.humedad} onChange={(e) => updateL(i, "humedad", e.target.value)} placeholder="54" className={inputClass} />
                      </Field>
                      <Field label="Observaciones">
                        <input value={l.obs} onChange={(e) => updateL(i, "obs", e.target.value)} placeholder="—" className={inputClass} />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              <Actions saving={saving} onCancel={() => setMode("lista")} />
            </form>
          )}

          {mode === "ver" && selected && (
            <>
              <Back onClick={() => setMode("lista")} />
              <h1 className="text-[20px] font-semibold text-slate-800 mb-1">{fmt(selected.fecha)}</h1>
              <p className="text-[13.5px] text-slate-500 mb-6">Inspector: {selected.inspector}</p>
              <div className="space-y-3">
                {selected.lecturas.map((l, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-[13.5px]">
                    <p className="font-semibold text-slate-800">{l.area} · {l.punto}</p>
                    <p className="text-slate-500 mt-1">Hora {l.hora || "—"}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-slate-700">
                      <span>T° <strong>{l.temperatura || "—"}</strong> °C</span>
                      <span>HR <strong>{l.humedad || "—"}</strong> %</span>
                      {l.obs && <span className="text-slate-500">{l.obs}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <Footer />
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

function Breadcrumb({ current }: { current: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-slate-400 mb-4">
      <Link href="/dashboard" className="hover:text-slate-600">Inicio</Link>
      <ChevronRight size={14} />
      <Link href="/dashboard/microbiologia" className="hover:text-slate-600">Microbiología</Link>
      <ChevronRight size={14} />
      <span className="text-slate-600">{current}</span>
    </div>
  );
}

function Header({
  code,
  title,
  subtitle,
  onNew,
}: {
  code: string;
  title: string;
  subtitle: string;
  onNew: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        <p className="text-[11px] font-medium text-slate-400 tracking-wide mb-1">{code}</p>
        <h1 className="text-[22px] font-semibold text-slate-800 tracking-tight mb-1">{title}</h1>
        <p className="text-[13.5px] text-slate-500">{subtitle}</p>
      </div>
      <button onClick={onNew} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium">
        <Plus size={16} /> Nuevo registro
      </button>
    </div>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-800 mb-6">
      <ArrowLeft size={15} /> Volver al listado
    </button>
  );
}

function Empty({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
      <p className="text-[14px] font-medium text-slate-700 mb-1">Sin lecturas aún</p>
      <p className="text-[13px] text-slate-400 mb-5">Registra la primera toma del día</p>
      <button onClick={onNew} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 text-white text-[13.5px] font-medium">
        <Plus size={15} /> Nuevo registro
      </button>
    </div>
  );
}

function ListRow({
  title,
  subtitle,
  onView,
  onDelete,
}: {
  title: string;
  subtitle: string;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-slate-800">{title}</p>
        <p className="text-[13px] text-slate-500">{subtitle}</p>
      </div>
      <button onClick={onView} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Eye size={16} /></button>
      <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
    </div>
  );
}

function Actions({ saving, onCancel }: { saving: boolean; onCancel: () => void }) {
  return (
    <div className="flex gap-3">
      <button type="button" onClick={onCancel} className="h-11 px-5 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600">Cancelar</button>
      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium disabled:opacity-60">
        <Save size={15} /> {saving ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-3 text-center text-[11px] text-slate-400 border-t border-slate-100">
      Exportadora RomEx S.A. — QMS Sistema de Gestión de Laboratorio
    </footer>
  );
}
