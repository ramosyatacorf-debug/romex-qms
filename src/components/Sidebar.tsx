"use client";

import Link from "next/link";
import Image from "next/image";
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
      <div className="h-16 flex items-center justify-between px-3 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center max-w-[160px]">
          <Image
            src="/logo_romex.jpg"
            alt="RomEx Quality Management System"
            width={150}
            height={40}
            className="object-contain w-full h-auto"
            priority
          />
        </Link>
        <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors shrink-0 ml-1">
          <Menu size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2.5 space-y-0.5">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${
            pathname === "/dashboard"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Home size={16} strokeWidth={pathname === "/dashboard" ? 2.2 : 1.8} />
          Inicio
        </Link>

        <Link
          href="/dashboard/qualy-ai"
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${
            pathname === "/dashboard/qualy-ai"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
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
      <div className="border-t border-slate-100 p-2.5 space-y-0.5">
        <Link
          href="/dashboard/configuraciones"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Settings size={16} strokeWidth={1.8} />
          configuraciones
        </Link>

        <div className="flex items-center gap-2.5 px-2.5 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <User size={14} />
          </div>
          <p className="text-[12.5px] font-medium text-slate-800 truncate">{userName}</p>
        </div>
      </div>
    </aside>
  );
}
