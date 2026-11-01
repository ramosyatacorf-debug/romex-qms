"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bot, Settings, Menu, User } from "lucide-react";

interface SidebarProps {
  userName?: string;
}

export default function Sidebar({ userName = "Rodrigo Ramos Yataco" }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Inicio", icon: Home },
    { href: "/dashboard/qualy-ai", label: "Qualy AI", icon: Bot },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col">
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M12 2C8 2 5 5.5 5 9.5c0 3.5 2 6.5 5 8.5 1.5-1 2.5-2.5 3-4 .5 1.5 1.5 3 3 4 3-2 5-5 5-8.5C21 5.5 18 2 12 2z" />
            </svg>
          </div>
          <div>
            <div className="text-slate-800 font-bold text-base leading-none tracking-tight">RomEx</div>
            <div className="text-[9px] text-slate-500 font-medium tracking-wider uppercase mt-0.5">
              Quality Management System
            </div>
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Menu size={18} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3 space-y-1">
        <Link
          href="/dashboard/configuraciones"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
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
