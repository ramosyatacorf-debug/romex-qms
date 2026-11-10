"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  PanelLeftClose,
  PanelLeft,
  User,
  Microscope,
  FolderOpen,
} from "lucide-react";
import QualyIcon from "@/components/QualyIcon";

interface SidebarProps {
  userName?: string;
  collapsed: boolean;
  onToggle: () => void;
}

function NavItem({
  href,
  title,
  active,
  collapsed,
  icon,
  children,
}: {
  href: string;
  title: string;
  active: boolean;
  collapsed: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      title={title}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      } ${collapsed ? "justify-center px-0" : ""}`}
    >
      {icon}
      {!collapsed && <span>{children}</span>}
    </Link>
  );
}

export default function Sidebar({
  userName = "Rodrigo Ramos Yataco",
  collapsed,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/dashboard";
  const isMicro = pathname.startsWith("/dashboard/microbiologia");
  const isGuias = pathname.startsWith("/dashboard/guias");
  const isQualy = pathname.startsWith("/dashboard/qualy-ai");

  return (
    <aside
      className={`h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo — portal RomEx QMS */}
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

      <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
        {/* Portal */}
        <NavItem
          href="/dashboard"
          title="Inicio"
          active={isHome}
          collapsed={collapsed}
          icon={
            <Home size={18} strokeWidth={isHome ? 2.2 : 1.8} className="shrink-0" />
          }
        >
          Inicio
        </NavItem>

        {/* Separador de módulos del ecosistema */}
        {!collapsed && (
          <p className="px-3 pt-4 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Módulos
          </p>
        )}
        {collapsed && <div className="h-2" />}

        <NavItem
          href="/dashboard/microbiologia"
          title="Microbiología"
          active={isMicro}
          collapsed={collapsed}
          icon={
            <Microscope size={18} strokeWidth={isMicro ? 2.2 : 1.8} className="shrink-0" />
          }
        >
          Microbiología
        </NavItem>

        <NavItem
          href="/dashboard/guias"
          title="Gestión de Guías"
          active={isGuias}
          collapsed={collapsed}
          icon={
            <FolderOpen size={18} strokeWidth={isGuias ? 2.2 : 1.8} className="shrink-0" />
          }
        >
          Gestión de Guías
        </NavItem>

        <NavItem
          href="/dashboard/qualy-ai"
          title="Qualy AI"
          active={isQualy}
          collapsed={collapsed}
          icon={<QualyIcon size={18} className="shrink-0" />}
        >
          Qualy AI
        </NavItem>
      </nav>

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
