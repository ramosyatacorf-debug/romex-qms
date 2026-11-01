import Link from "next/link";
import { ArrowRight, Microscope, FlaskConical } from "lucide-react";

interface ModuleCardProps {
  number: string;
  title: string;
  href?: string;
  icon?: "microscope" | "flask" | "empty";
}

const icons = {
  microscope: Microscope,
  flask: FlaskConical,
  empty: null,
};

export default function ModuleCard({
  number,
  title,
  href = "#",
  icon = "empty",
}: ModuleCardProps) {
  const Icon = icons[icon];

  return (
    <Link
      href={href}
      className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200 min-h-[148px] flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-8">
        <div>
          <p className="text-[11px] text-slate-400 font-medium mb-1.5 tracking-wide">
            {number}
          </p>
          <h3 className="text-[14px] font-semibold text-slate-800 leading-snug">
            {title || "\u00A0"}
          </h3>
        </div>

        {Icon && (
          <div className="text-teal-600/80 shrink-0 mt-0.5">
            <Icon size={24} strokeWidth={1.4} />
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-slate-100 flex justify-end">
        <ArrowRight
          size={15}
          className="text-slate-300 group-hover:text-slate-500 transition-colors"
        />
      </div>
    </Link>
  );
}
