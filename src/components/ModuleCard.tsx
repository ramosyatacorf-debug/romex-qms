import Link from "next/link";
import { ArrowRight, Microscope, FlaskConical, FolderOpen } from "lucide-react";

interface ModuleCardProps {
  number: string;
  title: string;
  href?: string;
  icon?: "microscope" | "flask" | "folder" | "empty";
}

const icons = {
  microscope: Microscope,
  flask: FlaskConical,
  folder: FolderOpen,
  empty: null,
};

export default function ModuleCard({
  number,
  title,
  href = "#",
  icon = "empty",
}: ModuleCardProps) {
  const Icon = icons[icon];
  const isEmpty = !title;

  return (
    <Link
      href={href}
      className={`group bg-white border border-slate-200 rounded-xl p-5 transition-all duration-200 min-h-[128px] flex flex-col ${
        isEmpty
          ? "opacity-60 hover:opacity-80"
          : "hover:border-blue-200 hover:shadow-md hover:shadow-blue-50/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <p className="text-[11px] text-slate-400 font-medium mb-1 tracking-wide">
            {number}
          </p>
          <h3 className="text-[14px] font-semibold text-slate-800 leading-snug">
            {title || "Próximamente"}
          </h3>
        </div>

        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
            <Icon size={18} strokeWidth={1.6} />
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-slate-100 flex justify-end">
        <ArrowRight
          size={15}
          className={`transition-all ${
            isEmpty
              ? "text-slate-200"
              : "text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5"
          }`}
        />
      </div>
    </Link>
  );
}
