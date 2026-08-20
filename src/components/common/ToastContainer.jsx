import React from "react";
import { useApp } from "../../context/AppContext";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Sparkles,
} from "lucide-react";

export const ToastContainer = () => {
  const { toasts, dismissToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-md z-50 pointer-events-none flex flex-col gap-2.5 items-center sm:items-end"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success" || !toast.type;
        const isError = toast.type === "error" || toast.type === "danger";
        const isWarning = toast.type === "warning";
        const isInfo = toast.type === "info";

        let borderColor = "border-l-emerald-500";
        let iconBg = "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400";
        let IconComponent = CheckCircle2;
        let title = "Success";

        if (isError) {
          borderColor = "border-l-rose-500";
          iconBg = "bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400";
          IconComponent = AlertCircle;
          title = "Notice / Error";
        } else if (isWarning) {
          borderColor = "border-l-amber-500";
          iconBg = "bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400";
          IconComponent = AlertTriangle;
          title = "Warning";
        } else if (isInfo) {
          borderColor = "border-l-blue-600";
          iconBg = "bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400";
          IconComponent = Info;
          title = "Information";
        }

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto app-panel rounded-2xl p-3.5 sm:p-4 shadow-xl border-t border-r border-b border-slate-200 dark:border-slate-800 border-l-4 ${borderColor} max-w-md w-full flex items-start gap-3 animate-in slide-in-from-top-3 fade-in duration-200 transition-all bg-white dark:bg-slate-900`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${iconBg}`}>
              <IconComponent className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                {title}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug break-words">
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
