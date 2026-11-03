"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Settings, PanelLeftClose, PanelLeft, User } from "lucide-react";

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
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="h-[68px] flex items-center gap-2 px-3 border-b border-slate-100">
        {!collapsed && (
          <Link href="/dashboard" className="flex-1 flex items-center min-w-0">
            <Image
              src="/logo_romex.jpg"
              alt="RomEx"
              width={140}
              height={38}
              className="object-contain object-left h-9 w-auto"
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
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M12 2a3.5 3.5 0 0 1 3.5 3.5V7H8.5V5.5A3.5 3.5 0 0 1 12 2z" />
            <rect x="8" y="7" width="8" height="5.5" rx="1.8" />
            <circle cx="10.5" cy="9.7" r="0.7" fill="currentColor" stroke="none" />
            <circle cx="13.5" cy="9.7" r="0.7" fill="currentColor" stroke="none" />
            <path d="M9.5 12.5v2.2a2.5 2.5 0 0 0 5 0v-2.2" />
            <path d="M8 18.5h8" />
            <path d="M10 18.5v2" />
            <path d="M14 18.5v2" />
          </svg>
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
