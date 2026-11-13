"use client";

import MicroShell from "@/components/MicroShell";
import Link from "next/link";
import { Microscope, ArrowLeft } from "lucide-react";

export default function MicroAnio2026Page() {
  return (
    <MicroShell title="Microbiología 2026" code="Consolidado anual · Próximamente">
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Microscope size={28} />
        </div>
        <h1 className="text-[20px] font-semibold text-slate-800 mb-2">Análisis microbiológico 2026</h1>
        <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
          Vista consolidada del año a partir de los registros diarios y mensuales del laboratorio.
        </p>
        <Link
          href="/dashboard/microbiologia"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-white"
        >
          <ArrowLeft size={14} /> Volver al inicio
        </Link>
      </div>
    </MicroShell>
  );
}
