"use client";

import MicroShell from "@/components/MicroShell";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";

export default function GranoPage() {
  return (
    <MicroShell title="Grano 2026" code="Calidad de grano · Próximamente">
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <Package size={28} strokeWidth={1.6} />
        </div>
        <h1 className="text-[20px] font-semibold text-slate-800 mb-2">Control de calidad de grano</h1>
        <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
          Registro por procedencia (Yurimaguas, Quillabamba, etc.): humedad, impurezas, acidez, calibre y vínculo con guías de remisión.
        </p>
        <Link
          href="/dashboard/microbiologia"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={14} /> Volver al inicio ZORKA
        </Link>
      </div>
    </MicroShell>
  );
}
