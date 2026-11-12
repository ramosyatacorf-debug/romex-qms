"use client";

import Link from "next/link";
import { FlaskConical, ArrowLeft } from "lucide-react";

export default function FisicoQuimicoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--md-surface)] px-4">
      <div className="max-w-md w-full text-center py-12 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
          <FlaskConical size={28} />
        </div>
        <h1 className="text-[20px] font-semibold text-slate-800 mb-2">Físico Químico</h1>
        <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
          Módulo en preparación. Aquí se registrarán ensayos físico-químicos y resultados de control de calidad.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={14} /> Volver al portal
        </Link>
      </div>
    </div>
  );
}
