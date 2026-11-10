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
  ArrowLeft,
  Thermometer,
  Bug,
  FileText,
} from "lucide-react";
import QualyIcon from "@/components/QualyIcon";

interface SidebarProps {
  userName?: string;
  collapsed: boolean;
  onToggle: () => void;
}

function NavLink({
  href,
  active,
  collapsed,
  icon,
  children,
  external,
}: {
  href: string;
  active: boolean;
  collapsed: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
    active
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  } ${collapsed ? "justify-center px-0" : ""}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={typeof children === "string" ? children : undefined}
        className={className}
      >
        {icon}
        {!collapsed && <span className="truncate">{children}</span>}
      </a>
    );
  }

  return (
    <Link
      href={href}
      title={typeof children === "string" ? children : undefined}
      className={className}
    >
      {icon}
      {!collapsed && <span className="truncate">{children}</span>}
    </Link>
  );
}

function PortalNav({ collapsed, pathname }: { collapsed: boolean; pathname: string }) {
  return (
    <>
      <NavLink
        href="/dashboard"
        active={pathname === "/dashboard"}
        collapsed={collapsed}
        icon={<Home size={18} strokeWidth={pathname === "/dashboard" ? 2.2 : 1.8} className="shrink-0" />}
      >
        Portal
      </NavLink>

      {!collapsed && (
        <p className="px-3 pt-5 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Sistemas
        </p>
      )}
      {collapsed && <div className="h-3" />}

      <NavLink
        href="/dashboard/microbiologia"
        active={false}
        collapsed={collapsed}
        external
        icon={<Microscope size={18} strokeWidth={1.8} className="shrink-0" />}
      >
        Microbiología
      </NavLink>

      <NavLink
        href="/dashboard/guias"
        active={false}
        collapsed={collapsed}
        external
        icon={<FolderOpen size={18} strokeWidth={1.8} className="shrink-0" />}
      >
        Gestión de Guías
      </NavLink>

      <NavLink
        href="/dashboard/qualy-ai"
        active={false}
        collapsed={collapsed}
        icon={<QualyIcon size={18} className="shrink-0" />}
      >
        Qualy AI
      </NavLink>
    </>
  );
}

function MicroNav({ collapsed, pathname }: { collapsed: boolean; pathname: string }) {
  const items = [
    {
      href: "/dashboard/microbiologia",
      label: "Inicio del módulo",
      icon: <Home size={17} className="shrink-0" />,
      exact: true,
    },
    {
      href: "/dashboard/microbiologia/enterobacterias",
      label: "Enterobacterias",
      icon: <FileText size={17} className="shrink-0" />,
    },
    {
      href: "/dashboard/microbiologia/ambientes",
      label: "Control de ambientes",
      icon: <Thermometer size={17} className="shrink-0" />,
    },
    {
      href: "/dashboard/microbiologia/sshh",
      label: "SS.HH.",
      icon: <ClipboardIcon />,
    },
    {
      href: "/dashboard/microbiologia/plagas",
      label: "Plagas",
      icon: <Bug size={17} className="shrink-0" />,
    },
  ];

  return (
    <>
      <Link
        href="/dashboard"
        title="Volver al portal QMS"
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors mb-2 ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <ArrowLeft size={16} className="shrink-0" />
        {!collapsed && <span>Portal QMS</span>}
      </Link>

      {!collapsed && (
        <div className="px-3 py-2 mb-1">
          <p className="text-[11px] font-semibold text-violet-600 uppercase tracking-wider">Microbiología</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Sistema de laboratorio</p>
        </div>
      )}

      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <NavLink
            key={item.href}
            href={item.href}
            active={active}
            collapsed={collapsed}
            icon={item.icon}
          >
            {item.label}
          </NavLink>
        );
      })}
    </>
  );
}

function ClipboardIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function QualyNav({ collapsed }: { collapsed: boolean }) {
  return (
    <>
      <Link
        href="/dashboard"
        title="Volver al portal QMS"
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors mb-2 ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <ArrowLeft size={16} className="shrink-0" />
        {!collapsed && <span>Portal QMS</span>}
      </Link>

      {!collapsed && (
        <div className="px-3 py-2 mb-1">
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Qualy AI</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Asistente inteligente</p>
        </div>
      )}

      <NavLink
        href="/dashboard/qualy-ai"
        active
        collapsed={collapsed}
        icon={<QualyIcon size={17} className="shrink-0" />}
      >
        Conversación
      </NavLink>
    </>
  );
}

export default function Sidebar({
  userName = "Rodrigo Ramos Yataco",
  collapsed,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();

  // Hub de micro y guías tienen UI propia; el sidebar solo aplica a sub-registros y Qualy
  const isMicroSub =
    pathname.startsWith("/dashboard/microbiologia/") &&
    pathname !== "/dashboard/microbiologia";
  const isQualy = pathname.startsWith("/dashboard/qualy-ai");
  const isPortal = !isMicroSub && !isQualy;

  return (
    <aside
      className={`h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      <div className="h-[76px] flex items-center gap-2 px-3 border-b border-slate-100">
        {!collapsed && (
          <Link href="/dashboard" className="flex-1 flex items-center min-w-0 py-1">
            <Image
              src="/logo_romex.jpg"
              alt="RomEx Quality Management System"
              width={160}
              height={44}
              className="object-contain object-left w-full max-h-11"
              style={{ mixBlendMode: "multiply" }}
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

      <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto">
        {isPortal && <PortalNav collapsed={collapsed} pathname={pathname} />}
        {isMicroSub && <MicroNav collapsed={collapsed} pathname={pathname} />}
        {isQualy && <QualyNav collapsed={collapsed} />}
      </nav>

      <div className="border-t border-slate-100 p-2.5 space-y-1">
        {isPortal && (
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
        )}

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
