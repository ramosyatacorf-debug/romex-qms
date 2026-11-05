"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Settings, PanelLeftClose, PanelLeft, User } from "lucide-react";
import QualyIcon from "@/components/QualyIcon";

interface SidebarProps {
  userName?: string;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  userName = "Rodrigo Ramos Yataco",
  collapsed,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Header con logo */}
      <div className="h-[76px] flex items-center gap-2 px-3 border-b border-slate-100">
        {!collapsed && (
          <Link href="/dashboard" className="flex-1 flex items-center min-w-0 py-1">
            <Image
              src="/logo_romex.jpg"
              alt="RomEx Quality Management System"
              width={160}
              height={44}
              className="object-contain object-left w-full max-h-11"
              priority
            />
          </Link>
        )}

        <button
          onClick={onToggle}
          className={`p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors shrink-0 ${
            collapsed ? "mx-auto" : ""
          }`}
          title={collapsed ? "Expandir menú" : "Ocultar menú"}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2.5 space-y-1">
        <Link
          href="/dashboard"
          title="Inicio"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
            pathname === "/dashboard"
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          } ${collapsed ? "justify-center px-0" : ""}`}
        >
          <Home
            size={18}
            strokeWidth={pathname === "/dashboard" ? 2.2 : 1.8}
            className="shrink-0"
          />
          {!collapsed && <span>Inicio</span>}
        </Link>

        <Link
          href="/dashboard/qualy-ai"
          title="Qualy AI"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
            pathname === "/dashboard/qualy-ai"
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          } ${collapsed ? "justify-center px-0" : ""}`}
        >
          <QualyIcon size={18} className="shrink-0" />
          {!collapsed && <span>Qualy AI</span>}
        </Link>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 p-2.5 space-y-1">
        <Link
          href="/dashboard/configuraciones"
          title="Configuraciones"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <Settings size={18} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && <span>Configuraciones</span>}
        </Link>

        <div
          className={`flex items-center gap-3 px-3 py-2.5 ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title={userName}
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <User size={15} />
          </div>
          {!collapsed && (
            <p className="text-[13px] font-medium text-slate-800 truncate">{userName}</p>
          )}
        </div>
      </div>
    </aside>
  );
}
