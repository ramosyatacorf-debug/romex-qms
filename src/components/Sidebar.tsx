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
  Warehouse,
  Activity,
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
  const className = `flex items-center gap-3 px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
    active
      ? "text-[var(--md-on-secondary-container)]"
      : "text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)] hover:bg-[var(--md-surface-container)]"
  } ${collapsed ? "justify-center px-0" : ""}`;

  const style = active
    ? {
        background: "var(--md-secondary-container)",
        borderRadius: "var(--md-radius-full)",
      }
    : { borderRadius: "var(--md-radius-full)" };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={typeof children === "string" ? children : undefined}
        className={className}
        style={style}
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
      style={style}
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
        <p
          className="px-3 pt-5 pb-1.5 text-[11px] font-medium uppercase tracking-[0.08em]"
          style={{ color: "var(--md-on-surface-variant)" }}
        >
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
        active={pathname.startsWith("/dashboard/qualy-ai")}
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
      label: "Ambientes",
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
    {
      href: "/dashboard/microbiologia/almacenes",
      label: "Almacenes",
      icon: <Warehouse size={17} className="shrink-0" />,
    },
    {
      href: "/dashboard/microbiologia/monitoreo",
      label: "Monitoreo",
      icon: <Activity size={17} className="shrink-0" />,
    },
  ];

  return (
    <>
      <Link
        href="/dashboard"
        title="Volver al portal QMS"
        className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-colors mb-2 ${
          collapsed ? "justify-center px-0" : ""
        }`}
        style={{
          color: "var(--md-on-surface-variant)",
          borderRadius: "var(--md-radius-full)",
        }}
      >
        <ArrowLeft size={16} className="shrink-0" />
        {!collapsed && <span>Portal QMS</span>}
      </Link>

      {!collapsed && (
        <div className="px-3 py-2 mb-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "var(--md-primary)" }}>
            Microbiología
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--md-on-surface-variant)" }}>
            Sistema de laboratorio
          </p>
        </div>
      )}

      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <NavLink key={item.href} href={item.href} active={active} collapsed={collapsed} icon={item.icon}>
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
        className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-colors mb-2 ${
          collapsed ? "justify-center px-0" : ""
        }`}
        style={{
          color: "var(--md-on-surface-variant)",
          borderRadius: "var(--md-radius-full)",
        }}
      >
        <ArrowLeft size={16} className="shrink-0" />
        {!collapsed && <span>Portal QMS</span>}
      </Link>

      {!collapsed && (
        <div className="px-3 py-2 mb-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "var(--md-primary)" }}>
            Qualy AI
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--md-on-surface-variant)" }}>
            Asistente inteligente
          </p>
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

  const isMicroSub =
    pathname.startsWith("/dashboard/microbiologia/") && pathname !== "/dashboard/microbiologia";
  const isQualy = pathname.startsWith("/dashboard/qualy-ai");
  const isPortal = !isMicroSub && !isQualy;

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
      style={{
        background: "var(--md-surface-container-low)",
        borderRight: "1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent)",
      }}
    >
      <div
        className="h-[72px] flex items-center gap-2 px-3"
        style={{
          borderBottom: "1px solid color-mix(in srgb, var(--md-outline-variant) 45%, transparent)",
        }}
      >
        {!collapsed && (
          <Link href="/dashboard" className="flex-1 flex items-center min-w-0 py-1">
            <Image
              src="/logo_romex.jpg"
              alt="RomEx Quality Management System"
              width={160}
              height={44}
              className="object-contain object-left w-full max-h-10"
              style={{ mixBlendMode: "multiply" }}
              priority
            />
          </Link>
        )}

        <button
          type="button"
          onClick={onToggle}
          className={`p-2 transition-colors shrink-0 hover:bg-[var(--md-surface-container)] ${
            collapsed ? "mx-auto" : ""
          }`}
          style={{
            color: "var(--md-on-surface-variant)",
            borderRadius: "var(--md-radius-full)",
          }}
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

      <div
        className="p-2.5 space-y-1"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--md-outline-variant) 45%, transparent)",
        }}
      >
        {isPortal && (
          <Link
            href="/dashboard"
            title="Configuraciones"
            className={`flex items-center gap-3 px-3 py-2.5 text-[13.5px] font-medium transition-colors hover:bg-[var(--md-surface-container)] ${
              collapsed ? "justify-center px-0" : ""
            }`}
            style={{
              color: "var(--md-on-surface-variant)",
              borderRadius: "var(--md-radius-full)",
            }}
          >
            <Settings size={18} strokeWidth={1.8} className="shrink-0" />
            {!collapsed && <span>Configuraciones</span>}
          </Link>
        )}

        <div className={`flex items-center gap-3 px-3 py-2.5 ${collapsed ? "justify-center px-0" : ""}`} title={userName}>
          <div
            className="w-8 h-8 flex items-center justify-center shrink-0"
            style={{
              borderRadius: "var(--md-radius-full)",
              background: "var(--md-primary-container)",
              color: "var(--md-on-primary-container)",
            }}
          >
            <User size={15} />
          </div>
          {!collapsed && (
            <p className="text-[13px] font-medium truncate" style={{ color: "var(--md-on-surface)" }}>
              {userName}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
