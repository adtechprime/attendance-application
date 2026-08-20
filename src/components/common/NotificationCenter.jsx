import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Bell,
  X,
  CheckCircle2,
  Clock,
  Zap,
  Receipt,
  FileText,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const NotificationCenter = ({ isOpen, onClose, onNavigateTab }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  if (!isOpen) return null;

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);

    if (notif.type === "overtime_alert") {
      onNavigateTab("overtime");
    } else if (notif.type === "late_punch") {
      onNavigateTab("attendance");
    } else if (notif.type === "money_transfer" || notif.type === "expense_voucher") {
      onNavigateTab("expenses");
    } else {
      onNavigateTab("dashboard");
    }
    onClose();
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "overtime_alert":
        return <Zap className="w-4 h-4 text-amber-500" />;
      case "late_punch":
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case "money_transfer":
      case "expense_voucher":
        return <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "daily_report_submitted":
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm app-panel border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Notification Center
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {notifications.filter((n) => !n.isRead).length} Unread Alerts
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
              >
                Mark Read
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No notifications at this time.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border text-xs flex items-start gap-3 ${
                    notif.isRead
                      ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      : "bg-blue-50 dark:bg-slate-900 border-blue-200 dark:border-blue-800/80 text-slate-900 dark:text-slate-100 shadow-sm"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-xs flex items-center justify-between">
                      <span className="truncate">{notif.title}</span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1.5 font-mono">
                      {notif.date}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
