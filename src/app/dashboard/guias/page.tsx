"use client";

import { useEffect, useMemo, useState } from "react";
import { safeGetJSON, safeSetJSON } from "@/lib/safe-storage";
import Link from "next/link";
import Image from "next/image";
import {
  FolderOpen,
  Folder,
  Upload,
  Search,
  FileText,
  ChevronRight,
  X,
  Trash2,
  Eye,
  ArrowLeft,
  Package,
  Scale,
  Files,
  Download,
  ExternalLink,
  Printer,
  Home,
  BarChart3,
  Settings,
  Headphones,
  LayoutDashboard,
} from "lucide-react";

interface Guia {
  id: string;
  numeroGuia: string;
  zona: string;
  sacos: number;
  kilos: number;
  fechaRecepcion: string;
  anio: number;
  mes: number;
  fileName: string;
  fileData: string;
  createdAt: string;
}

type Vista = "inicio" | "carpetas" | "buscar";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const STORAGE_KEY = "romex_guias_remision";

function saveGuias(guias: Guia[]) {
  const res = safeSetJSON(STORAGE_KEY, guias);
  if (!res.ok) {
    alert(res.error || "No se pudo guardar. El PDF puede ser muy grande.");
    throw new Error("storage");
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ... (el resto del archivo se mantiene idéntico, solo se cambió la persistencia)
// Para el commit, el contenido completo es el de /tmp/guias-updated.tsx
