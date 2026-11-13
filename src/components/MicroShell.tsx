"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut, FlaskConical, ArrowLeft } from "lucide-react";

const NAV = [
  { href: "/dashboard/microbiologia", label: "Inicio", exact: true },
  { href: "/dashboard/microbiologia/enterobacterias", label: "Enterobacterias" },
  { href: "/dashboard/microbiologia/ambientes", label: "Ambientes" },
  { href: "/dashboard/microbiologia/sshh", label: "SS.HH." },
  { href: "/dashboard/microbiologia/plagas", label: "Plagas" },
  { href: "/dashboard/microbiologia/almacenes", label: "Almacenes" },
  { href: "/dashboard/microbiologia/monitoreo", label: "Monitoreo" },
];

export default function MicroShell({
  children,
  title,
  code,
}: {
  children: React.ReactNode;
  title?: string;
  code?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[#eef3fb]">
      <aside className="hidden md:flex w-[220px] shrink-0 flex-col bg-white border-r border-slate-200/80">
        <div className="px-4 pt-5 pb-4">
          <Link href="/dashboard/microbiologia" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FlaskConical size={20} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-800 tracking-tight leading-none">RomEx</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Microbiología</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-2.5 space-y-0.5">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 h-9 px-3 rounded-xl text-[12.5px] font-medium transition-colors ${
                  active
                    ? "bg-sky-50 text-sky-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-slate-100 space-y-0.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12.5px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          >
            <LogOut size={15} />
            Portal QMS
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[56px] bg-white/85 backdrop-blur border-b border-slate-200/70 px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-900 truncate">{title || "Microbiología"}</p>
            <p className="text-[11px] text-sky-600 font-medium truncate">{code || "Exportadora RomEx S.A."}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/microbiologia"
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[12px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 md:hidden"
            >
              <ArrowLeft size={14} />
              Inicio
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[12px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            >
              <Home size={14} />
              <span className="hidden sm:inline">Portal</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-7">{children}</main>

        <footer className="px-4 sm:px-6 py-2.5 text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
          <span>Sistema de Microbiología · RomEx QMS</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            En línea
          </span>
        </footer>
      </div>
    </div>
  );
}
