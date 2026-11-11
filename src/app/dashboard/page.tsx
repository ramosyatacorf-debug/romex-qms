"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ModuleCard from "@/components/ModuleCard";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

function todayLabel() {
  return new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const saludo = useMemo(() => greeting(), []);
  const fecha = useMemo(() => todayLabel(), []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <header className="mb-10 max-w-3xl">
            <p className="text-[12px] font-medium text-slate-400 tracking-wide uppercase mb-2">
              Portal del ecosistema
            </p>
            <h1 className="text-[26px] sm:text-[28px] font-semibold text-slate-900 tracking-tight mb-2">
              {saludo}, Rodrigo
            </h1>
            <p className="text-slate-500 text-[14.5px] leading-relaxed capitalize">
              {fecha}
            </p>
            <p className="text-slate-500 text-[14px] leading-relaxed mt-3 max-w-xl">
              Cada módulo es un sistema independiente. Inicia sesión una vez y entra a Microbiología, Guías u otros sin volver a autenticarte.
            </p>
          </header>

          <section className="mb-3">
            <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Sistemas disponibles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-w-5xl">
              <ModuleCard
                number="01"
                title="Microbiología"
                description="Registros diarios del laboratorio: ambientes, higiene, plagas, almacenes y monitoreo"
                href="/dashboard/microbiologia"
                icon="microscope"
                status="ready"
                newWindow
              />
              <ModuleCard
                number="02"
                title="Gestión de Guías"
                description="Archivo de guías de remisión de cacao organizadas por año y mes"
                href="/dashboard/guias"
                icon="folder"
                status="ready"
                newWindow
              />
              <ModuleCard
                number="03"
                title="Qualy AI"
                description="Asistente del laboratorio para consultas rápidas del ecosistema"
                href="/dashboard/qualy-ai"
                icon="ai"
                status="ready"
              />
              <ModuleCard
                number="04"
                title="Físico Químico"
                description="Ensayos físico-químicos y resultados de control de calidad"
                href="/dashboard/fisico-quimico"
                icon="flask"
                status="soon"
              />
            </div>
          </section>
        </div>

        <footer className="py-3.5 text-center text-[11px] text-slate-400 border-t border-slate-100">
          Exportadora RomEx S.A. — Quality Management System
        </footer>
      </main>
    </div>
  );
}
