"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Microscope,
  Bug,
  Thermometer,
  FlaskConical,
  ClipboardList,
  CalendarDays,
  Shirt,
  Home,
  ArrowUpRight,
  CheckCircle2,
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
    icon: <Microscope size={18} strokeWidth={1.7} />,
    items: [
      {
        code: "MICRO-PROD",
        title: "Microbiología de producto",
        description: "Torta, manteca, cocoa · RTAW, mohos, coliformes, E. coli",
        freq: "Diario",
        href: "/dashboard/microbiologia/producto",
        ready: false,
      },
      {
        code: "LM-RAE-004",
        title: "Enterobacterias",
        description: "Barreduras y residuos en planta · UFC/g por punto",
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
    icon: <Thermometer size={18} strokeWidth={1.7} />,
    items: [
      {
        code: "LM-IP-020",
        title: "Control de ambientes",
        description: "Temperatura y humedad relativa por área",
        freq: "Diario",
        href: "/dashboard/microbiologia/ambientes",
        ready: true,
      },
      {
        code: "A-LDAMP-R-017",
        title: "Limpieza de almacenes",
        description: "Limpieza y desinfección R/NR · desinfectante y ppm",
        freq: "Diario",
        href: "/dashboard/microbiologia/almacenes",
        ready: true,
      },
      {
        code: "LM-IP-R-003",
        title: "SS.HH. varones y damas",
        description: "Inspección de servicios higiénicos",
        freq: "Diario",
        href: "/dashboard/microbiologia/sshh",
        ready: true,
      },
      {
        code: "LM-MM",
        title: "Monitoreo ambiental",
        description: "Placas por área · RTAMV, mohos y levaduras",
        freq: "Mensual",
        href: "/dashboard/microbiologia/monitoreo",
        ready: true,
      },
    ],
  },
  {
    id: "plagas",
    title: "Control de plagas",
    subtitle: "Monitoreo de roedores y aves",
    icon: <Bug size={18} strokeWidth={1.7} />,
    items: [
      {
        code: "LM-CP-R-004",
        title: "Población de roedores y aves",
        description: "Avistamientos, umbrales y acciones correctivas",
        freq: "Por evento",
        href: "/dashboard/microbiologia/plagas",
        ready: true,
      },
      {
        code: "LM-CP-R-010",
        title: "Resumen mensual de plagas",
        description: "Observaciones del mes y eficacia",
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
    icon: <FlaskConical size={18} strokeWidth={1.7} />,
    items: [
      {
        code: "LM-PAC-L-010",
        title: "Consumo de medios de cultivo",
        description: "Ingreso, lote y uso de plate count",
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
    id: "extra",
    title: "Monitoreo adicional",
    subtitle: "Ropa de trabajo y cloración",
    icon: <Shirt size={18} strokeWidth={1.7} />,
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
        description: "Registro diario de dosis de cloro",
        freq: "Diario",
        href: "/dashboard/microbiologia/cloracion",
        ready: false,
      },
    ],
  },
];

const FREQ_STYLE: Record<Freq, string> = {
  Diario: "bg-emerald-50 text-emerald-700",
  Semanal: "bg-sky-50 text-sky-700",
  Mensual: "bg-violet-50 text-violet-700",
  "Por evento": "bg-amber-50 text-amber-700",
};

export default function MicrobiologiaHubPage() {
  const todos = GRUPOS.flatMap((g) => g.items);
  const listos = todos.filter((i) => i.ready);
  const pendientes = todos.length - listos.length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header del sistema */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="shrink-0 flex items-center">
              <Image
                src="/logo_romex.jpg"
                alt="RomEx"
                width={112}
                height={32}
                className="object-contain h-8 w-auto max-w-[120px]"
                style={{ mixBlendMode: "multiply" }}
                priority
              />
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 leading-tight">Microbiología</p>
              <p className="text-[11px] text-violet-600 font-medium leading-tight">Sistema de laboratorio</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            title="Volver al portal QMS"
          >
            <Home size={15} />
            <span className="hidden sm:inline">Portal</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Título + métricas */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[22px] sm:text-[24px] font-semibold text-slate-900 tracking-tight">
              Registros del laboratorio
            </h1>
            <p className="text-slate-500 text-[14px] mt-1 max-w-lg">
              Formatos diarios y periódicos alineados a los procedimientos de planta.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-white border border-slate-200 text-[12.5px] text-slate-600">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="font-medium text-slate-800">{listos.length}</span> activos
            </div>
            <div className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-white border border-slate-200 text-[12.5px] text-slate-500">
              {pendientes} próximos
            </div>
          </div>
        </div>

        {/* Acceso rápido */}
        {listos.length > 0 && (
          <section className="mb-10">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Acceso rápido
            </p>
            <div className="flex flex-wrap gap-2">
              {listos.map((item) => (
                <Link
                  key={item.code}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white border border-slate-200 text-[13px] font-medium text-slate-700 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50/60 transition-colors"
                >
                  {item.title}
                  <ArrowUpRight size={13} className="text-slate-300" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Grupos */}
        <div className="space-y-11">
          {GRUPOS.map((grupo) => (
            <section key={grupo.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  {grupo.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-slate-900">{grupo.title}</h2>
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
      </main>

      <footer className="py-3.5 text-center text-[11px] text-slate-400 border-t border-slate-100">
        Exportadora RomEx S.A. — Microbiología
      </footer>
    </div>
  );
}

function RegistroCard({ item }: { item: Registro }) {
  const content = (
    <div
      className={`group relative flex flex-col gap-3 p-4 sm:p-5 rounded-2xl border bg-white transition-all duration-200 ${
        item.ready
          ? "border-slate-200 hover:border-violet-200 hover:shadow-md hover:shadow-violet-50/50 cursor-pointer"
          : "border-slate-100 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-400 tracking-wide mb-1">{item.code}</p>
          <h3 className="text-[14.5px] font-semibold text-slate-900 leading-snug">{item.title}</h3>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${FREQ_STYLE[item.freq]}`}
        >
          <CalendarDays size={11} />
          {item.freq}
        </span>
      </div>

      <p className="text-[13px] text-slate-500 leading-relaxed flex-1">{item.description}</p>

      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        {item.ready ? (
          <span className="text-[12.5px] font-medium text-violet-600 group-hover:text-violet-700 transition-colors">
            Abrir registro
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-400">
            <ClipboardList size={13} />
            Próximamente
          </span>
        )}
        {item.ready && (
          <ArrowUpRight size={15} className="text-slate-300 group-hover:text-violet-500 transition-colors" />
        )}
      </div>
    </div>
  );

  if (item.ready) {
    return (
      <Link href={item.href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
