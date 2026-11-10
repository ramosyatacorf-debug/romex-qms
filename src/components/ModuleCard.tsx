import Link from "next/link";
import { ArrowUpRight, Microscope, FlaskConical, FolderOpen } from "lucide-react";

interface ModuleCardProps {
  number: string;
  title: string;
  description?: string;
  href?: string;
  icon?: "microscope" | "flask" | "folder" | "empty";
  status?: "ready" | "soon";
  /** Abre el sistema en una pestaña nueva (sistema independiente) */
  newWindow?: boolean;
}

const icons = {
  microscope: Microscope,
  flask: FlaskConical,
  folder: FolderOpen,
  empty: null,
};

const tone = {
  microscope: {
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    hover: "hover:border-violet-200 hover:shadow-violet-50/50",
  },
  flask: {
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    hover: "hover:border-sky-200 hover:shadow-sky-50/50",
  },
  folder: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    hover: "hover:border-amber-200 hover:shadow-amber-50/50",
  },
  empty: {
    iconBg: "bg-slate-50",
    iconColor: "text-slate-300",
    hover: "",
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
      className={`group relative bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-200 min-h-[152px] flex flex-col ${
        isSoon
          ? "opacity-60 pointer-events-none"
          : `${t.hover} hover:shadow-md`
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
          {number}
        </p>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl ${t.iconBg} ${t.iconColor} flex items-center justify-center shrink-0`}
          >
            <Icon size={19} strokeWidth={1.6} />
          </div>
        )}
      </div>

      <h3 className="text-[15px] font-semibold text-slate-800 leading-snug mb-1.5">
        {title || "Próximamente"}
      </h3>

      {description && (
        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {isSoon ? (
          <span className="text-[12px] text-slate-400">En preparación</span>
        ) : (
          <span className="text-[12.5px] font-medium text-slate-500 group-hover:text-slate-800 transition-colors">
            {newWindow ? "Abrir en nueva ventana" : "Abrir sistema"}
          </span>
        )}
        {!isSoon && (
          <ArrowUpRight
            size={16}
            className="text-slate-300 group-hover:text-slate-600 transition-colors"
          />
        )}
      </div>
    </div>
  );

  if (isSoon) return body;

  if (newWindow) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {body}
      </a>
    );
  }

  return <Link href={href}>{body}</Link>;
}
