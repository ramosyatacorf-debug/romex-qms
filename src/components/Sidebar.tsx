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

  const navItems = [
    { href: "/dashboard", label: "Inicio", icon: "home" as const },
    { href: "/dashboard/qualy-ai", label: "Qualy AI", icon: "qualy" as const },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/romex-logo.png"
            alt="RomEx Quality Management System"
            width={130}
            height={36}
            className="object-contain"
            priority
          />
        </Link>
        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Menu size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.icon === "qualy" ? (
                <Image
                  src="/qualy-ai-icon.png"
                  alt="Qualy AI"
                  width={18}
                  height={18}
                  className="object-contain opacity-80"
                />
              ) : (
                <Home size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              )}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-100 p-3 space-y-1">
        <Link
          href="/dashboard/configuraciones"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <Settings size={18} strokeWidth={1.8} />
          configuraciones
        </Link>

        <div className="flex items-center gap-3 px-3 py-2.5 mt-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{userName}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
