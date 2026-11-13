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
import { ArrowLeft, Plus, Save, Bath } from "lucide-react";
import { safeGetJSON, safeSetJSON } from "@/lib/safe-storage";

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
  return safeGetJSON<RegistroSSHH[]>(STORAGE_KEY, []);
}

function save(items: RegistroSSHH[]) {
  const res = safeSetJSON(STORAGE_KEY, items);
  if (!res.ok && res.error) alert(res.error);
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
    <MicroShell title="Inspección SS.HH." code="LM-IP-R-003">
      {mode === "lista" && (
        <>
          <PageHeader
            title="Inspección SS.HH."
            subtitle="Limpieza y desinfección · 1 vez al día · C = Conforme · N = No conforme"
            action={
              <PrimaryButton onClick={() => setMode("nuevo")}>
                <Plus size={16} /> Nueva inspección
              </PrimaryButton>
            }
          />

          {sorted.length === 0 ? (
            <EmptyState
              icon={Bath}
              title="Sin inspecciones aún"
              description="Registra la inspección diaria de SS.HH. de varones o damas."
              action={
                <PrimaryButton onClick={() => setMode("nuevo")} className="h-10 px-4 text-[13.5px]">
                  <Plus size={15} /> Nueva inspección
                </PrimaryButton>
              }
            />
          ) : (
            <div className="space-y-2.5">
              {sorted.map((r) => {
                const nc = r.items.filter((i) => i.estado === "N").length;
                return (
                  <ListRow
                    key={r.id}
                    icon={Bath}
                    title={`${fmt(r.fecha)} · ${r.hora} · ${r.tipo === "varones" ? "Varones" : "Damas"}`}
                    subtitle={`${r.inspector}${nc > 0 ? ` · ${nc} no conforme(s)` : " · Todo conforme"}`}
                    onView={() => {
                      setSelected(r);
                      setMode("ver");
                    }}
                    onDelete={() => handleDelete(r.id)}
                  />
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
          <h1 className="text-[20px] font-semibold text-slate-900 mb-6">Nueva inspección</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-5 bg-white border border-slate-200 rounded-2xl">
            <Field label="Fecha">
              <input required type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Hora">
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={inputClass} />
            </Field>
            <Field label="SS.HH.">
              <select value={tipo} onChange={(e) => setTipo(e.target.value as "varones" | "damas")} className={inputClass}>
                <option value="varones">Varones</option>
                <option value="damas">Damas</option>
              </select>
            </Field>
            <Field label="Personal de limpieza">
              <input value={personal} onChange={(e) => setPersonal(e.target.value)} placeholder="José / Luzmila" className={inputClass} />
            </Field>
            <Field label="Inspector">
              <input value={inspector} onChange={(e) => setInspector(e.target.value)} placeholder="Nereyda" className={inputClass} />
            </Field>
          </div>

          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Checklist</p>
            <p className="text-[12px] text-slate-400">C = Conforme · N = No conforme</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {checks.map((c) => (
              <div
                key={c.id}
                className={`flex items-center justify-between gap-3 bg-white border rounded-xl px-3 py-2.5 transition-colors ${
                  c.estado === "N" ? "border-red-200" : "border-slate-200"
                }`}
              >
                <span className="text-[13.5px] text-slate-700">{c.label}</span>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEstado(c.id, "C")}
                    className={`h-8 w-9 rounded-lg text-[12px] font-semibold transition-colors ${
                      c.estado === "C" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    C
                  </button>
                  <button
                    type="button"
                    onClick={() => setEstado(c.id, "N")}
                    className={`h-8 w-9 rounded-lg text-[12px] font-semibold transition-colors ${
                      c.estado === "N" ? "bg-red-500 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    N
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <Field label="Observaciones / acción correctiva">
              <input
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Pisos con licor, papelera sin bolsas..."
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
            onClick={() => setMode("lista")}
            className="inline-flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-800 mb-6"
          >
            <ArrowLeft size={15} /> Volver al listado
          </button>
          <div className="mb-6">
            <h1 className="text-[20px] font-semibold text-slate-900">
              {fmt(selected.fecha)} · {selected.tipo === "varones" ? "Varones" : "Damas"}
            </h1>
            <p className="text-[13.5px] text-slate-500 mt-1">
              {selected.hora} · Limpieza: {selected.personalLimpieza} · Inspector: {selected.inspector}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {selected.items.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-[13.5px]"
              >
                <span className="text-slate-700">{c.label}</span>
                <span
                  className={`inline-flex h-6 min-w-[28px] items-center justify-center rounded-md text-[12px] font-semibold ${
                    c.estado === "N" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {c.estado || "—"}
                </span>
              </div>
            ))}
          </div>
          {selected.observaciones && (
            <p className="text-[13.5px] text-slate-600 bg-white border border-slate-200 rounded-xl p-4">
              {selected.observaciones}
            </p>
          )}
        </>
      )}
    </MicroShell>
  );
}
