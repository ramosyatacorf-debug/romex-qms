import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export const inputClass =
  "w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight mb-1">{title}</h1>
        {subtitle && <p className="text-[13.5px] text-slate-500 leading-relaxed">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 bg-white border border-dashed border-slate-200 rounded-2xl">
      <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center mb-4">
        <Icon size={22} strokeWidth={1.7} />
      </div>
      <p className="text-[14px] font-medium text-slate-800 mb-1">{title}</p>
      {description && (
        <p className="text-[13px] text-slate-400 mb-5 max-w-sm leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}

export function ListRow({
  icon: Icon,
  title,
  subtitle,
  onView,
  onDelete,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onView?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center gap-3.5 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
        <Icon size={18} strokeWidth={1.7} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-slate-900 truncate">{title}</p>
        {subtitle && <p className="text-[13px] text-slate-500 mt-0.5 truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        {onView && (
          <button
            type="button"
            onClick={onView}
            className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
            title="Ver"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Eliminar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-medium shadow-sm shadow-violet-600/15 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-white transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
