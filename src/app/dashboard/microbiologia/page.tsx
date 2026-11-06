"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import {
  Microscope,
  Bug,
  Thermometer,
  FlaskConical,
  ClipboardList,
  ChevronRight,
  CalendarDays,
  Shirt,
} from "lucide-react";

type Freq = "Diario" | "Semanal" | "Mensual" | "Por evento";

interface Registro {
  code: string;
  title: string;
  description: string;
  freq: Freq;
  href: string;
  ready?: boolean;
}

interface Grupo {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: Registro[];
}

const GRUPOS: Grupo[] = [
  {
    id: "producto",
    title: "Análisis de producto",
    subtitle: "Liberación microbiológica de lotes",
    icon: <Microscope size={18} />,
    items: [
      {
        code: "MICRO-PROD",
        title: "Microbiología de producto",
        description: "Torta, manteca, cocoa y productos terminados · RTAW, mohos, coliformes, E. coli, enterobacterias",
        freq: "Diario",
        href: "/dashboard/microbiologia/producto",
        ready: false,
      },
      {
        code: "LM-RAE-004",
        title: "Enterobacterias (barreduras y residuos)",
        description: "Puntos de barredura y residuo en planta · UFC/g por punto",
        freq: "Mensual",
        href: "/dashboard/microbiologia/enterobacterias",
        ready: true,
      },
    ],
  },
  {
    id: "ambiente",
    title: "Ambiente e higiene",
    subtitle: "Condiciones y limpieza de áreas",
    icon: <Thermometer size={18} />,
    items: [
      {
        code: "LM-IP-020",
        title: "Control de ambientes",
        description: "Temperatura y humedad relativa por área y punto",
        freq: "Diario",
        href: "/dashboard/microbiologia/ambientes",
        ready: true,
      },
      {
        code: "A-LDAMP-R-017",
        title: "Limpieza de almacenes",
        description: "Limpieza y desinfección de almacén de materia prima y productos terminados",
        freq: "Diario",
        href: "/dashboard/microbiologia/almacenes",
        ready: false,
      },
      {
        code: "LM-IP-R-003",
        title: "SS.HH. varones y damas",
        description: "Inspección de limpieza y desinfección de servicios higiénicos",
        freq: "Diario",
        href: "/dashboard/microbiologia/sshh",
        ready: true,
      },
    ],
  },
  {
    id: "plagas",
    title: "Control de plagas",
    subtitle: "Monitoreo de roedores y aves",
    icon: <Bug size={18} />,
    items: [
      {
        code: "LM-CP-R-004",
        title: "Población de roedores y aves",
        description: "Registro de avistamientos, umbrales y acciones correctivas",
        freq: "Por evento",
        href: "/dashboard/microbiologia/plagas",
        ready: true,
      },
      {
        code: "LM-CP-R-010",
        title: "Resumen mensual de plagas",
        description: "Observaciones resaltantes del mes y eficacia",
        freq: "Mensual",
        href: "/dashboard/microbiologia/plagas-resumen",
        ready: false,
      },
    ],
  },
  {
    id: "lab",
    title: "Laboratorio",
    subtitle: "Medios de cultivo y controles internos",
    icon: <FlaskConical size={18} />,
    items: [
      {
        code: "LM-PAC-L-010",
        title: "Consumo de medios de cultivo",
        description: "Ingreso, lote, destino y fechas de uso de plate count y otros",
        freq: "Diario",
        href: "/dashboard/microbiologia/medios",
        ready: false,
      },
      {
        code: "LM-PAC-R-003",
        title: "Control de pH de medios",
        description: "pHi, ajuste y pHf de agar plate count",
        freq: "Diario",
        href: "/dashboard/microbiologia/ph-medios",
        ready: false,
      },
    ],
  },
  {
    id: "monitoreo",
    title: "Monitoreo adicional",
    subtitle: "Ropa de trabajo y cloración",
    icon: <Shirt size={18} />,
    items: [
      {
        code: "LM-MM-R-17",
        title: "Lavado de ropa de trabajo",
        description: "RTAMV, S. aureus y coliformes en prendas",
        freq: "Mensual",
        href: "/dashboard/microbiologia/ropa",
        ready: false,
      },
      {
        code: "LM-CLOR-R-098",
        title: "Cloración de poza y shiler",
        description: "Registro diario de dosis de cloro / lejía",
        freq: "Diario",
        href: "/dashboard/microbiologia/cloracion",
        ready: false,
      },
    ],
  },
];

const FREQ_STYLE: Record<Freq, string> = {
  Diario: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Semanal: "bg-sky-50 text-sky-700 border-sky-100",
  Mensual: "bg-violet-50 text-violet-700 border-violet-100",
  "Por evento": "bg-amber-50 text-amber-700 border-amber-100",
};

export default function MicrobiologiaHubPage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-[13px] text-slate-400 mb-3">
              <Link href="/dashboard" className="hover:text-slate-600">Inicio</Link>
              <ChevronRight size={14} />
              <span className="text-slate-600">Microbiología</span>
            </div>
            <h1 className="text-[24px] font-semibold text-slate-800 tracking-tight mb-1.5">
              Microbiología
            </h1>
            <p className="text-slate-500 text-[14px] max-w-2xl">
              Registros diarios y periódicos del laboratorio. Selecciona un formato para capturar o consultar.
            </p>
          </div>

          <div className="space-y-10">
            {GRUPOS.map((grupo) => (
              <section key={grupo.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                    {grupo.icon}
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-slate-800">{grupo.title}</h2>
                    <p className="text-[12.5px] text-slate-500">{grupo.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {grupo.items.map((item) => (
                    <RegistroCard key={item.code} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer className="py-3 text-center text-[11px] text-slate-400 border-t border-slate-100">
          Exportadora RomEx S.A. — QMS Sistema de Gestión de Laboratorio
        </footer>
      </main>
    </div>
  );
}

function RegistroCard({ item }: { item: Registro }) {
  const content = (
    <div
      className={`group flex flex-col gap-3 p-4 rounded-2xl border bg-white transition-all ${
        item.ready
          ? "border-slate-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-50/50 cursor-pointer"
          : "border-slate-100 opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-400 tracking-wide mb-1">{item.code}</p>
          <h3 className="text-[14.5px] font-semibold text-slate-800 leading-snug">{item.title}</h3>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium ${FREQ_STYLE[item.freq]}`}>
          <CalendarDays size={11} />
          {item.freq}
        </span>
      </div>
      <p className="text-[13px] text-slate-500 leading-relaxed">{item.description}</p>
      <div className="flex items-center justify-between pt-1">
        {item.ready ? (
          <span className="text-[12.5px] font-medium text-blue-600 group-hover:text-blue-700">Abrir registro →</span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-400">
            <ClipboardList size={13} />
            Próximamente
          </span>
        )}
      </div>
    </div>
  );

  if (item.ready) return <Link href={item.href}>{content}</Link>;
  return content;
}
