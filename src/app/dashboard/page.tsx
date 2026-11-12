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
    <div className="flex min-h-screen" style={{ background: "var(--md-surface)" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <header className="mb-10 max-w-3xl">
            <p
              className="text-[11px] font-medium tracking-[0.08em] uppercase mb-2"
              style={{ color: "var(--md-on-surface-variant)" }}
            >
              Portal del ecosistema
            </p>
            <h1
              className="text-[28px] sm:text-[32px] font-normal tracking-tight mb-1.5 leading-tight"
              style={{ color: "var(--md-on-surface)" }}
            >
              {saludo}, Rodrigo
            </h1>
            <p
              className="text-[14px] leading-relaxed capitalize"
              style={{ color: "var(--md-on-surface-variant)" }}
            >
              {fecha}
            </p>
            <p
              className="text-[14px] leading-relaxed mt-3 max-w-xl"
              style={{ color: "var(--md-on-surface-variant)" }}
            >
              Elige un sistema. Cada uno se abre de forma independiente con su propia interfaz.
            </p>
          </header>

          <section>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2
                className="text-[12px] font-medium uppercase tracking-[0.08em]"
                style={{ color: "var(--md-on-surface-variant)" }}
              >
                Sistemas
              </h2>
              <span className="text-[12px]" style={{ color: "var(--md-on-surface-variant)" }}>
                3 activos · 1 en preparación
              </span>
            </div>
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

        <footer
          className="py-3.5 text-center text-[11px] border-t"
          style={{
            color: "var(--md-on-surface-variant)",
            borderColor: "color-mix(in srgb, var(--md-outline-variant) 50%, transparent)",
          }}
        >
          Exportadora RomEx S.A. — Quality Management System
        </footer>
      </main>
    </div>
  );
}
