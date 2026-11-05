"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ModuleCard from "@/components/ModuleCard";

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-6 py-7 md:px-10 md:py-9">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-[22px] font-semibold text-slate-800 mb-1 tracking-tight">
              ¡Hola Rodrigo!
            </h1>
            <p className="text-slate-500 text-[13.5px] leading-relaxed max-w-lg">
              Bienvenido al QMS del laboratorio de Exportadora RomEx S.A. Selecciona un módulo para comenzar.
            </p>
          </div>

          {/* Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-w-4xl">
            <ModuleCard
              number="Módulo 01"
              title="Microbiología"
              href="/dashboard/microbiologia"
              icon="microscope"
            />
            <ModuleCard
              number="Módulo 02"
              title="Físico Químico"
              href="/dashboard/fisico-quimico"
              icon="flask"
            />
            <ModuleCard
              number="Módulo 03"
              title="Gestión de Guías"
              href="/dashboard/guias"
              icon="folder"
            />
            <ModuleCard number="Módulo 04" title="" href="#" icon="empty" />
            <ModuleCard number="Módulo 05" title="" href="#" icon="empty" />
          </div>
        </div>

        <footer className="py-3 text-center text-[11px] text-slate-400 border-t border-slate-100">
          Exportadora RomEx S.A. — QMS Sistema de Gestión de Laboratorio
        </footer>
      </main>
    </div>
  );
}
