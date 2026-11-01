"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Menu, User } from "lucide-react";

interface SidebarProps {
  userName?: string;
}

export default function Sidebar({ userName = "Rodrigo Ramos Yataco" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          {/* Logo SVG estilo RomEx (siempre visible) */}
          <svg width="26" height="26" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M20 3.5C13.5 3.5 8.5 9.2 8.5 16.2C8.5 21.8 12 27 18 30.5C19.8 28.7 21 26.2 21.5 23.8C22 26.2 23.2 28.7 25 30.5C31 27 34.5 21.8 34.5 16.2C34.5 9.2 29.5 3.5 20 3.5Z" fill="#0f172a"/>
            <path d="M15.5 13C15.5 13 18 10.5 20 13C22 10.5 24.5 13 24.5 13C24.5 17.5 22.2 20 20 22C17.8 20 15.5 17.5 15.5 13Z" fill="#0f172a" opacity="0.85"/>
          </svg>
          <div className="leading-none">
            <div className="text-[16.5px] font-bold text-slate-900 tracking-tight">RomEx</div>
            <div className="text-[8.5px] text-slate-500 font-medium tracking-[0.05em] uppercase mt-[2px]">
              Quality Management System
            </div>
          </div>
        </Link>

        <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors">
          <Menu size={17} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-0.5">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
            pathname === "/dashboard"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Home size={17} strokeWidth={pathname === "/dashboard" ? 2.2 : 1.8} />
          Inicio
        </Link>

        <Link
          href="/dashboard/qualy-ai"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
            pathname === "/dashboard/qualy-ai"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3.5 3.5 0 0 1 3.5 3.5V7H8.5V5.5A3.5 3.5 0 0 1 12 2z" />
            <rect x="8" y="7" width="8" height="5.5" rx="1.8" />
            <circle cx="10.5" cy="9.7" r="0.7" fill="currentColor" stroke="none" />
            <circle cx="13.5" cy="9.7" r="0.7" fill="currentColor" stroke="none" />
            <path d="M9.5 12.5v2.2a2.5 2.5 0 0 0 5 0v-2.2" />
            <path d="M8 18.5h8" />
            <path d="M10 18.5v2" />
            <path d="M14 18.5v2" />
          </svg>
          Qualy AI
        </Link>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 p-3 space-y-0.5">
        <Link
          href="/dashboard/configuraciones"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Settings size={17} strokeWidth={1.8} />
          configuraciones
        </Link>

        <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
            <User size={15} />
          </div>
          <p className="text-[13px] font-medium text-slate-800 truncate">{userName}</p>
        </div>
      </div>
    </aside>
  );
}
