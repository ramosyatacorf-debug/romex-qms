"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import {
  ChevronRight,
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Eye,
  FileText,
} from "lucide-react";

interface PuntoResultado {
  codigo: string;
  punto: string;
  peso: string;
  resultado: string;
  observaciones: string;
  accionCorrectiva: string;
}

interface RegistroEB {
  id: string;
  fechaToma: string;
  fechaAnalisis: string;
  barreduras: PuntoResultado[];
  residuos: PuntoResultado[];
  eficacia: string;
  analista: string;
  createdAt: string;
}

const BARREDURAS_BASE: Omit<
  PuntoResultado,
  "peso" | "resultado" | "observaciones" | "accionCorrectiva"
>[] = [
  { codigo: "EBB-1", punto: "Barredura de Sala de Tostado (GRANDE)" },
  { codigo: "EBB-2", punto: "Barredura en Sala de Homogenizado" },
  { codigo: "EBB-3", punto: "Barredura en Sala de Prensa" },
  { codigo: "EBB-4", punto: "Barredura en Sala de Temperado" },
  { codigo: "EBB-5", punto: "Barredura en Sala de Pulverizado" },
  { codigo: "EBB-6", punto: "Barredura de Sala de Tostado (PEQUEÑO)" },
  { codigo: "EBB-7", punto: "Barredura en Almacén de Productos Terminados" },
  { codigo: "EBB-8", punto: "Barredura en sala de Esterilizado" },
  { codigo: "EBB-9", punto: "Barredura en sala de alcalinizado - tanque reactor" },
];

const RESIDUOS_BASE: Omit<
  PuntoResultado,
  "peso" | "resultado" | "observaciones" | "accionCorrectiva"
>[] = [
  { codigo: "EBR-1", punto: "Residuo en tanques de Homogenizado" },
  { codigo: "EBR-2", punto: "Residuo en Faja y/o bandeja Receptora de Torta" },
  { codigo: "EBR-3", punto: "Residuo en Bandeja receptoras de residuos de Torta" },
  { codigo: "EBR-4", punto: "Residuo en Shute de salida de Temperadoras" },
  { codigo: "EBR-5", punto: "Residuo en el rompetorta (Tolvas de Molino IPC)" },
  { codigo: "EBR-6", punto: "Residuo en tanque alcalinizador (reactor)" },
  { codigo: "EBR-7", punto: "Residuo en tanques de Esterilizado" },
];

const STORAGE_KEY = "romex_enterobacterias";

function emptyPuntos(
  base: typeof BARREDURAS_BASE
): PuntoResultado[] {
  return base.map((b) => ({
    ...b,
    peso: "",
    resultado: "<10 ufc/grs",
    observaciones: "",
    accionCorrectiva: "",
  }));
}

function loadRegistros(): RegistroEB[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RegistroEB[]) : [];
  } catch {
    return [];
  }
}

function saveRegistros(items: RegistroEB[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatDateDisplay(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-3 mt-2">
      {children}
    </h2>
  );
}

function PuntoCard({
  p,
  onChange,
}: {
  p: PuntoResultado;
  onChange: (field: keyof PuntoResultado, value: string) => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="mb-3">
        <p className="text-[12px] font-semibold text-blue-600">{p.codigo}</p>
        <p className="text-[13.5px] font-medium text-slate-800 mt-0.5">{p.punto}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Peso de la muestra">
          <input
            value={p.peso}
            onChange={(e) => onChange("peso", e.target.value)}
            placeholder="22,5 grs"
            className={inputClass}
          />
        </Field>
        <Field label="Resultado UFC/g">
          <input
            value={p.resultado}
            onChange={(e) => onChange("resultado", e.target.value)}
            placeholder="menor a 10 ufc/grs"
            className={inputClass}
          />
        </Field>
        <Field label="Observaciones">
          <input
            value={p.observaciones}
            onChange={(e) => onChange("observaciones", e.target.value)}
            placeholder="barrido de toda el área"
            className={inputClass}
          />
        </Field>
        <Field label="Acción correctiva">
          <input
            value={p.accionCorrectiva}
            onChange={(e) => onChange("accionCorrectiva", e.target.value)}
            placeholder="—"
            className={inputClass}
          />
        </Field>
      </div>
    </div>
  );
}

function ViewTable({ points }: { points: PuntoResultado[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <th className="px-4 py-2.5 font-medium">Código</th>
              <th className="px-4 py-2.5 font-medium">Punto</th>
              <th className="px-4 py-2.5 font-medium">Peso</th>
              <th className="px-4 py-2.5 font-medium">Resultado</th>
              <th className="px-4 py-2.5 font-medium">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.codigo} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-2.5 font-medium text-blue-600 whitespace-nowrap">{p.codigo}</td>
                <td className="px-4 py-2.5 text-slate-700 max-w-[220px]">{p.punto}</td>
                <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{p.peso || "—"}</td>
                <td className="px-4 py-2.5 font-medium text-slate-800 whitespace-nowrap">{p.resultado || "—"}</td>
                <td className="px-4 py-2.5 text-slate-500">{p.observaciones || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function EnterobacteriasPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [registros, setRegistros] = useState<RegistroEB[]>([]);
  const [mode, setMode] = useState<"lista" | "nuevo" | "ver">("lista");
  const [selected, setSelected] = useState<RegistroEB | null>(null);

  const [fechaToma, setFechaToma] = useState("");
  const [fechaAnalisis, setFechaAnalisis] = useState("");
  const [barreduras, setBarreduras] = useState<PuntoResultado[]>(() => emptyPuntos(BARREDURAS_BASE));
  const [residuos, setResiduos] = useState<PuntoResultado[]>(() => emptyPuntos(RESIDUOS_BASE));
  const [eficacia, setEficacia] = useState("ok");
  const [analista, setAnalista] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRegistros(loadRegistros());
  }, []);

  const sorted = useMemo(
    () => [...registros].sort((a, b) => b.fechaToma.localeCompare(a.fechaToma)),
    [registros]
  );

  const resetForm = () => {
    setFechaToma("");
    setFechaAnalisis("");
    setBarreduras(emptyPuntos(BARREDURAS_BASE));
    setResiduos(emptyPuntos(RESIDUOS_BASE));
    setEficacia("ok");
    setAnalista("");
  };

  const updatePunto = (
    tipo: "barreduras" | "residuos",
    index: number,
    field: keyof PuntoResultado,
    value: string
  ) => {
    if (tipo === "barreduras") {
      setBarreduras((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    } else {
      setResiduos((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaToma || !fechaAnalisis) return;
    setSaving(true);
    try {
      const nuevo: RegistroEB = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fechaToma,
        fechaAnalisis,
        barreduras,
        residuos,
        eficacia,
        analista: analista.trim() || "—",
        createdAt: new Date().toISOString(),
      };
      const updated = [nuevo, ...registros];
      setRegistros(updated);
      saveRegistros(updated);
      resetForm();
      setMode("lista");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este registro de enterobacterias?")) return;
    const updated = registros.filter((r) => r.id !== id);
    setRegistros(updated);
    saveRegistros(updated);
    if (selected?.id === id) {
      setSelected(null);
      setMode("lista");
    }
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
            <span className="text-slate-600">Enterobacterias</span>
          </div>

          {mode === "lista" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                  <p className="text-[11px] font-medium text-slate-400 tracking-wide mb-1">LM-RAE-004 · Edición 21</p>
                  <h1 className="text-[22px] font-semibold text-slate-800 tracking-tight mb-1">
                    Análisis de Enterobacterias
                  </h1>
                  <p className="text-[13.5px] text-slate-500">Barreduras y residuos · frecuencia mensual</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setMode("nuevo");
                  }}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium"
                >
                  <Plus size={16} />
                  Nuevo registro
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-[12px] font-medium text-slate-500 mb-2">Parámetros barreduras</p>
                  <ul className="text-[12.5px] text-slate-600 space-y-1">
                    <li>
                      <span className="text-emerald-600 font-medium">{