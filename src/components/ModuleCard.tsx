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
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    hover: "hover:border-violet-200/80 hover:shadow-[0_6px_20px_rgba(124,58,237,0.08)]",
    accent: "group-hover:text-violet-700",
  },
  flask: {
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    hover: "hover:border-sky-200/80 hover:shadow-[0_6px_20px_rgba(14,165,233,0.08)]",
    accent: "group-hover:text-sky-700",
  },
  folder: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    hover: "hover:border-amber-200/80 hover:shadow-[0_6px_20px_rgba(245,158,11,0.08)]",
    accent: "group-hover:text-amber-700",
  },
  ai: {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    hover: "hover:border-blue-200/80 hover:shadow-[0_6px_20px_rgba(37,99,235,0.08)]",
    accent: "group-hover:text-blue-700",
  },
  empty: {
    iconBg: "bg-slate-50",
    iconColor: "text-slate-300",
    hover: "",
    accent: "",
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
      className={`group relative bg-white border border-slate-200/90 rounded-2xl p-5 transition-all duration-200 min-h-[164px] flex flex-col ${
        isSoon
          ? "opacity-50"
          : `${t.hover} cursor-pointer`
      }`}
      style={isSoon ? undefined : { boxShadow: "0 1px 2px rgba(15,23,42,0.03)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <p className="text-[10.5px] text-slate-400 font-semibold tracking-[0.06em] uppercase pt-0.5">
          Sistema {number}
        </p>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl ${t.iconBg} ${t.iconColor} flex items-center justify-center shrink-0`}
          >
            <Icon size={17} strokeWidth={1.65} />
          </div>
        )}
      </div>

      <h3 className="text-[15px] font-semibold text-slate-900 leading-snug mb-1.5 tracking-tight">
        {title || "Próximamente"}
      </h3>

      {description && (
        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100/90 flex items-center justify-between">
        {isSoon ? (
          <span className="text-[12px] text-slate-400 font-medium">En preparación</span>
        ) : (
          <span className={`text-[12.5px] font-medium text-slate-500 transition-colors ${t.accent}`}>
            {newWindow ? "Abrir en nueva ventana" : "Abrir sistema"}
          </span>
        )}
        {!isSoon && (
          <ArrowUpRight
            size={15}
            className="text-slate-300 group-hover:text-slate-500 transition-colors"
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
