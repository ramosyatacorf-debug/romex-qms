"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FolderOpen, Upload, Search, FileText, MoreVertical } from "lucide-react";

export default function GuiasPage() {
  const [collapsed, setCollapsed] = useState(false);

  // Datos de ejemplo (luego conectamos con backend)
  const guias = [
    { id: 1, nombre: "Guía de muestreo microbiológico", categoria: "Microbiología", fecha: "2026-10-12", version: "v2.1" },
    { id: 2, nombre: "Procedimiento de análisis físico-químico", categoria: "Físico Químico", fecha: "2026-09-28", version: "v1.4" },
    { id: 3, nombre: "Protocolo de control de calidad", categoria: "Calidad", fecha: "2026-08-15", version: "v3.0" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-6 py-7 md:px-10 md:py-9">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                  <FolderOpen size={16} />
                </div>
                <h1 className="text-[22px] font-semibold text-slate-800 tracking-tight">
                  Gestión de Guías
                </h1>
              </div>
              <p className="text-slate-500 text-[13.5px]">
                Sistema de gestión y almacenamiento de guías del laboratorio
              </p>
            </div>

            <button className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-medium transition-colors">
              <Upload size={15} />
              Subir guía
            </button>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar guías..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3 text-[12px] font-medium text-slate-500">Nombre</th>
                  <th className="px-5 py-3 text-[12px] font-medium text-slate-500 hidden sm:table-cell">Categoría</th>
                  <th className="px-5 py-3 text-[12px] font-medium text-slate-500 hidden md:table-cell">Versión</th>
                  <th className="px-5 py-3 text-[12px] font-medium text-slate-500 hidden md:table-cell">Fecha</th>
                  <th className="px-5 py-3 text-[12px] font-medium text-slate-500 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {guias.map((guia) => (
                  <tr
                    key={guia.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <FileText size={14} />
                        </div>
                        <span className="text-[13.5px] font-medium text-slate-800">{guia.nombre}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-[12.5px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {guia.categoria}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-600 hidden md:table-cell">{guia.version}</td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-500 hidden md:table-cell">{guia.fecha}</td>
                    <td className="px-5 py-3.5">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="py-3 text-center text-[11px] text-slate-400 border-t border-slate-100">
          Exportadora RomEx S.A. — QMS Sistema de Gestión de Laboratorio
        </footer>
      </main>
    </div>
  );
}
