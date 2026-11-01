import Link from "next/link";
import { ArrowRight, Microscope, FlaskConical, Beaker } from "lucide-react";

interface ModuleCardProps {
  number: string;
  title: string;
  href?: string;
  icon?: "microscope" | "flask" | "beaker" | "empty";
}

const icons = {
  microscope: Microscope,
  flask: FlaskConical,
  beaker: Beaker,
  empty: null,
};

export default function ModuleCard({ number, title, href = "#", icon = "empty" }: ModuleCardProps) {
  const Icon = icons[icon];

  return (
    <Link
      href={href}
      className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 min-h-[160px] flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase mb-1">
            {number}
          </p>
          <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </div>
        {Icon && (
          <div className="text-slate-300 group-hover:text-blue-400 transition-colors">
            <Icon size={28} strokeWidth={1.4} />
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-end">
        <ArrowRight
          size={18}
          className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
        />
      </div>
    </Link>
  );
}
