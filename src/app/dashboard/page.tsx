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
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <div className="mb-10 max-w-2xl">
            <p className="text-[12px] font-medium text-slate-400 tracking-wide uppercase mb-2">
              Portal QMS
            </p>
            <h1 className="text-[26px] font-semibold text-slate-800 mb-2 tracking-tight">
              ¡Hola Rodrigo!
            </h1>
            <p className="text-slate-500 text-[14.5px] leading-relaxed">
              Bienvenido al ecosistema de Exportadora RomEx S.A. Elige un sistema para comenzar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-w-4xl">
            <ModuleCard
              number="Sistema 01"
              title="Microbiología"
              description="Registros diarios del laboratorio: ambientes, higiene, plagas y análisis"
              href="/dashboard/microbiologia"
              icon="microscope"
              status="ready"
            />
            <ModuleCard
              number="Sistema 02"
              title="Físico Químico"
              description="Ensayos físico-químicos y resultados de control de calidad"
              href="/dashboard/fisico-quimico"
              icon="flask"
              status="soon"
            />
            <ModuleCard
              number="Sistema 03"
              title="Gestión de Guías"
              description="Archivo de guías de remisión de cacao por año y mes"
              href="/dashboard/guias"
              icon="folder"
              status="ready"
              newWindow
            />
            <ModuleCard number="Sistema 04" title="" href="#" icon="empty" status="soon" />
            <ModuleCard number="Sistema 05" title="" href="#" icon="empty" status="soon" />
          </div>
        </div>

        <footer className="py-3 text-center text-[11px] text-slate-400 border-t border-slate-100">
          Exportadora RomEx S.A. — Quality Management System
        </footer>
      </main>
    </div>
  );
}
