"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between gap-4">
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
                <p className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
                  {title || "Microbiología"}
                </p>
                <p className="text-[11px] text-violet-600 font-medium truncate leading-tight">
                  {code || "Sistema de laboratorio"}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <Home size={15} />
              <span className="hidden md:inline">Portal</span>
            </Link>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto pb-2.5 -mt-0.5 scrollbar-none">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 h-8 px-3 rounded-lg text-[12.5px] font-medium transition-colors ${
                    active
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">{children}</main>

      <footer className="py-3.5 text-center text-[11px] text-slate-400 border-t border-slate-100">
        Exportadora RomEx S.A. — Microbiología
      </footer>
    </div>
  );
}
