"use client";

import MicroShell from "@/components/MicroShell";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PacPage() {
  return (
    <MicroShell title="PAC" code="LM-PAC · Próximamente">
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={28} />
        </div>
        <h1 className="text-[20px] font-semibold text-slate-800 mb-2">Control de Puntos Críticos (PAC)</h1>
        <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
          Este módulo estará disponible en la siguiente fase. Incluirá control de pH de medios y consumo de medios de cultivo según LM-PAC-R-003.
        </p>
        <Link
          href="/dashboard/microbiologia"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-white"
        >
          <ArrowLeft size={14} /> Volver al inicio ZORKA
        </Link>
      </div>
    </MicroShell>
  );
}
