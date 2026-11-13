"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  LayoutGrid,
  Settings,
  BarChart3,
  Info,
  LogOut,
  ArrowRight,
  Bug,
  Thermometer,
  Users,
  Brush,
  Monitor,
  ShieldCheck,
  Package,
  Microscope,
  FlaskConical,
  ChevronDown,
  CalendarDays,
  Clock,
} from "lucide-react";

interface Modulo {
  id: number;
  title: string;
  description: string;
  href: string;
  ready: boolean;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  arrowBg: string;
}

const MODULOS: Modulo[] = [
  {
    id: 1,
    title: "Enterobacterias",
    description: "Registro y control de Enterobacterias",
    href: "/dashboard/microbiologia/enterobacterias",
    ready: true,
    icon: <Bug size={26} strokeWidth={1.6} />,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-500",
    arrowBg: "bg-sky-500",
  },
  {
    id: 2,
    title: "Control de Ambiente",
    description: "Monitoreo y control del ambiente",
    href: "/dashboard/microbiologia/ambientes",
    ready: true,
    icon: <Thermometer size={26} strokeWidth={1.6} />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-500",
    arrowBg: "bg-emerald-500",
  },
  {
    id: 3,
    title: "SS.HH.",
    description: "Control sanitario de SS.HH.",
    href: "/dashboard/microbiologia/sshh",
    ready: true,
    icon: <Users size={26} strokeWidth={1.6} />,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
    arrowBg: "bg-violet-500",
  },
  {
    id: 4,
    title: "Plagas",
    description: "Control y monitoreo de plagas",
    href: "/dashboard/microbiologia/plagas",
    ready: true,
    icon: <Bug size={26} strokeWidth={1.6} />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    arrowBg: "bg-orange-500",
  },
  {
    id: 5,
    title: "Registro de Limpieza de Almacenes",
    description: "Control de limpieza de almacenes",
    href: "/dashboard/microbiologia/almacenes",
    ready: true,
    icon: <Brush size={26} strokeWidth={1.6} />,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-500",
    arrowBg: "bg-teal-500",
  },
  {
    id: 6,
    title: "Monitoreo",
    description: "Seguimiento y control de monitoreos",
    href: "/dashboard/microbiologia/monitoreo",
    ready: true,
    icon: <Monitor size={26} strokeWidth={1.6} />,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    arrowBg: "bg-cyan-500",
  },
  {
    id: 7,
    title: "PAC",
    description: "Control de Puntos Críticos (PAC)",
    href: "/dashboard/microbiologia/pac",
    ready: false,
    icon: <ShieldCheck size={26} strokeWidth={1.6} />,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-500",
    arrowBg: "bg-indigo-500",
  },
  {
    id: 8,
    title: "Grano 2026",
    description: "Control de calidad de grano",
    href: "/dashboard/microbiologia/grano",
    ready: false,
    icon: <Package size={26} strokeWidth={1.6} />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    arrowBg: "bg-amber-500",
  },
  {
    id: 9,
    title: "Microbiología 2026",
    description: "Análisis microbiológico del año 2026",
    href: "/dashboard/microbiologia/anio-2026",
    ready: false,
    icon: <Microscope size={26} strokeWidth={1.6} />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    arrowBg: "bg-blue-500",
  },
];

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function MicrobiologiaHubPage() {
  const now = useClock();
  const fecha = now.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const hora = now.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="min-h-screen flex bg-[#eef3fb]">
      <aside className="hidden md:flex w-[232px] shrink-0 flex-col bg-white border-r border-slate-200/80">
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <FlaskConical size={22} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[16px] font-bold text-slate-800 tracking-tight leading-none">RomEx</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">Microbiología</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          <SideItem href="/dashboard/microbiologia" icon={<Home size={17} />} label="Inicio" active />
          <SideItem href="/dashboard/microbiologia" icon={<LayoutGrid size={17} />} label="Módulos" chevron />
          <SideItem href="#" icon={<Settings size={17} />} label="Configuración" />
          <SideItem href="#" icon={<BarChart3 size={17} />} label="Reportes" />
          <SideItem href="#" icon={<Info size={17} />} label="Acerca de" />
          <div className="pt-2">
            <SideItem href="/dashboard" icon={<LogOut size={17} />} label="Salir" />
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-slate-50 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[12px] font-semibold">
              R
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-medium text-slate-700 truncate">Usuario</p>
              <p className="text-[11px] text-slate-400">Administrador</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[64px] bg-white/80 backdrop-blur border-b border-slate-200/70 px-5 sm:px-8 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[12px] text-slate-400 font-medium">Exportadora RomEx S.A.</p>
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#1e3a8a] tracking-tight leading-none">
              Microbiología
            </h1>
          </div>

          <div className="hidden lg:flex items-center gap-5 text-[12.5px] text-slate-500">
            <span className="text-slate-400">Control, análisis y calidad en cada proceso</span>
            <span className="h-4 w-px bg-slate-200" />
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} className="text-slate-400" />
              {fecha}
            </span>
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Clock size={14} className="text-slate-400" />
              {hora}
            </span>
          </div>
        </header>

        <main className="flex-1 px-5 sm:px-8 py-7 sm:py-8 relative overflow-hidden">
          <div className="pointer-events-none absolute right-0 top-0 w-[420px] h-[420px] opacity-[0.12]">
            <div className="absolute right-10 top-8 w-40 h-40 rounded-full border-2 border-sky-400" />
            <div className="absolute right-28 top-24 w-24 h-24 rounded-full border border-sky-300" />
          </div>

          <div className="relative max-w-5xl">
            <h2 className="text-[22px] sm:text-[26px] font-bold text-[#1e3a8a] tracking-tight mb-1.5">
              Bienvenido al Sistema de Microbiología
            </h2>
            <p className="text-[14px] text-slate-500 mb-8">
              Seleccione el módulo que desea gestionar:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {MODULOS.map((m) => (
                <ModuloCard key={m.id} modulo={m} />
              ))}
            </div>
          </div>
        </main>

        <footer className="px-5 sm:px-8 py-3 flex items-center justify-between text-[11.5px] text-slate-400 border-t border-slate-200/60 bg-white/50">
          <span>Sistema de Microbiología · RomEx QMS</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Sistema en línea
          </span>
        </footer>
      </div>
    </div>
  );
}

function SideItem({
  href,
  icon,
  label,
  active,
  chevron,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  chevron?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 h-10 px-3 rounded-xl text-[13px] font-medium transition-colors ${
        active
          ? "bg-sky-50 text-sky-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <span className={active ? "text-sky-600" : "text-slate-400"}>{icon}</span>
      <span className="flex-1">{label}</span>
      {chevron && <ChevronDown size={14} className="text-slate-300" />}
    </Link>
  );
}

function ModuloCard({ modulo }: { modulo: Modulo }) {
  const body = (
    <div
      className={`group relative bg-white rounded-2xl border border-slate-100 p-5 min-h-[118px] transition-all duration-200 ${
        modulo.ready
          ? "hover:shadow-[0_8px_30px_rgba(30,58,138,0.08)] hover:border-slate-200 cursor-pointer"
          : "opacity-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-2xl ${modulo.iconBg} ${modulo.iconColor} flex items-center justify-center shrink-0`}
        >
          {modulo.icon}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-[15px] font-semibold text-slate-800 tracking-tight leading-snug">
            {modulo.id}. {modulo.title}
          </h3>
          <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{modulo.description}</p>
        </div>
        <div
          className={`w-8 h-8 rounded-full ${modulo.arrowBg} text-white flex items-center justify-center shrink-0 mt-1 opacity-90 group-hover:opacity-100 transition-opacity`}
        >
          <ArrowRight size={15} strokeWidth={2.2} />
        </div>
      </div>
      {!modulo.ready && (
        <p className="mt-3 text-[11px] font-medium text-slate-400">Próximamente</p>
      )}
    </div>
  );

  if (!modulo.ready) return body;
  return (
    <Link href={modulo.href} className="block">
      {body}
    </Link>
  );
}
