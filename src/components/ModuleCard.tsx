import Link from "next/link";
import { ArrowUpRight, Microscope, FlaskConical, FolderOpen, Sparkles } from "lucide-react";

interface ModuleCardProps {
  number: string;
  title: string;
  description?: string;
  href?: string;
  icon?: "microscope" | "flask" | "folder" | "ai" | "empty";
  status?: "ready" | "soon";
  newWindow?: boolean;
}

const icons = {
  microscope: Microscope,
  flask: FlaskConical,
  folder: FolderOpen,
  ai: Sparkles,
  empty: null,
};

const tone = {
  microscope: {
    container: "bg-[var(--md-tertiary-container)] text-[var(--md-on-tertiary-container)]",
    hover: "hover:shadow-[var(--md-elevation-2)] hover:border-[color-mix(in_srgb,var(--md-tertiary)_28%,transparent)]",
    label: "group-hover:text-[var(--md-tertiary)]",
  },
  flask: {
    container: "bg-sky-100 text-sky-800",
    hover: "hover:shadow-[var(--md-elevation-2)] hover:border-sky-200",
    label: "group-hover:text-sky-700",
  },
  folder: {
    container: "bg-amber-100 text-amber-900",
    hover: "hover:shadow-[var(--md-elevation-2)] hover:border-amber-200",
    label: "group-hover:text-amber-800",
  },
  ai: {
    container: "bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)]",
    hover: "hover:shadow-[var(--md-elevation-2)] hover:border-[color-mix(in_srgb,var(--md-primary)_28%,transparent)]",
    label: "group-hover:text-[var(--md-primary)]",
  },
  empty: {
    container: "bg-[var(--md-surface-container)] text-[var(--md-on-surface-variant)]",
    hover: "",
    label: "",
  },
};

export default function ModuleCard({
  number,
  title,
  description,
  href = "#",
  icon = "empty",
  status = "ready",
  newWindow = false,
}: ModuleCardProps) {
  const Icon = icons[icon];
  const isEmpty = !title;
  const isSoon = status === "soon" || isEmpty;
  const t = tone[icon];

  const body = (
    <div
      className={`group relative flex flex-col min-h-[168px] p-5 transition-all duration-200 ${
        isSoon
          ? "opacity-50 cursor-default"
          : `cursor-pointer ${t.hover}`
      }`}
      style={{
        background: "var(--md-surface-container-lowest)",
        borderRadius: "var(--md-radius-lg)",
        border: "1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent)",
        boxShadow: isSoon ? "none" : "var(--md-elevation-1)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <p
          className="text-[11px] font-medium tracking-[0.08em] uppercase pt-1"
          style={{ color: "var(--md-on-surface-variant)" }}
        >
          Sistema {number}
        </p>
        {Icon && (
          <div
            className={`w-10 h-10 flex items-center justify-center shrink-0 ${t.container}`}
            style={{ borderRadius: "var(--md-radius-md)" }}
          >
            <Icon size={18} strokeWidth={1.7} />
          </div>
        )}
      </div>

      <h3
        className="text-[16px] font-medium leading-snug mb-1.5 tracking-tight"
        style={{ color: "var(--md-on-surface)" }}
      >
        {title || "Próximamente"}
      </h3>

      {description && (
        <p
          className="text-[13px] leading-relaxed line-clamp-2 flex-1"
          style={{ color: "var(--md-on-surface-variant)" }}
        >
          {description}
        </p>
      )}

      <div
        className="mt-4 pt-3 flex items-center justify-between"
        style={{ borderTop: "1px solid color-mix(in srgb, var(--md-outline-variant) 45%, transparent)" }}
      >
        {isSoon ? (
          <span className="text-[12px] font-medium" style={{ color: "var(--md-on-surface-variant)" }}>
            En preparación
          </span>
        ) : (
          <span
            className={`text-[13px] font-medium transition-colors ${t.label}`}
            style={{ color: "var(--md-on-surface-variant)" }}
          >
            {newWindow ? "Abrir en nueva ventana" : "Abrir sistema"}
          </span>
        )}
        {!isSoon && (
          <ArrowUpRight
            size={16}
            className="transition-colors"
            style={{ color: "var(--md-outline)" }}
          />
        )}
      </div>
    </div>
  );

  if (isSoon) return body;

  if (newWindow) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className="block">
      {body}
    </Link>
  );
}
