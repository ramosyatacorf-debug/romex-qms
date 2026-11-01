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

export default function ModuleCard({ number, title, href = "#", icon = "empty" }: ModuleCardProps) {
  const Icon = icons[icon];

  return (
    <Link
      href={href}
      className="group relative bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200 min-h-[150px] flex flex-col"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-slate-500 mb-1">{number}</p>
          <h3 className="text-sm font-medium text-slate-800">
            {title}
          </h3>
        </div>
        {Icon && (
          <div className="text-teal-600/70">
            <Icon size={26} strokeWidth={1.3} />
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-end">
        <ArrowRight
          size={16}
          className="text-slate-300 group-hover:text-slate-500 transition-colors"
        />
      </div>
    </Link>
  );
}
