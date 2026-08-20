import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Calendar, ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertCircle, Zap } from "lucide-react";

export const LabourAttendanceCalendar = () => {
  const { activeEmployee, attendance } = useApp();

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthName = currentMonthDate.toLocaleString("default", { month: "long" });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Filter attendance records for active employee in this month
  const empMonthAtt = attendance.filter((a) => {
    if (a.employeeId !== activeEmployee?.id) return false;
    const [aYear, aMonth] = a.date.split("-").map(Number);
    return aYear === year && aMonth === month + 1;
  });

  const presentDays = empMonthAtt.filter((a) => a.status === "present" || a.status === "late").length;
  const lateDays = empMonthAtt.filter((a) => a.status === "late").length;
  const otDays = empMonthAtt.filter((a) => a.overtimeStatus === "approved").length;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-md mx-auto space-y-4 pb-6">
      {/* Header & Month Navigator */}
      <div className="app-panel p-5 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Attendance Register
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {monthName} {year}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Month Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Present</div>
            <div className="text-xl font-black text-emerald-800 dark:text-emerald-300 mt-0.5">{presentDays}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400">Late Punches</div>
            <div className="text-xl font-black text-amber-800 dark:text-amber-300 mt-0.5">{lateDays}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-400">Approved OT</div>
            <div className="text-xl font-black text-blue-800 dark:text-blue-300 mt-0.5">{otDays}</div>
          </div>
        </div>
      </div>

      {/* Google Calendar-Style Monthly Grid */}
      <div className="app-card p-4 rounded-3xl space-y-3">
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-800">
          {weekDays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty prefix boxes */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 rounded-xl bg-slate-50 dark:bg-slate-900/40 opacity-30" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const att = empMonthAtt.find((a) => a.date === dateStr);

            const isPresent = att && (att.status === "present" || att.status === "late");
            const isLate = att?.status === "late";
            const isOtApproved = att?.overtimeStatus === "approved";

            return (
              <div
                key={dayNum}
                className={`min-h-[50px] sm:h-14 rounded-xl p-1 flex flex-col justify-between border transition-all text-xs ${
                  isPresent
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                }`}
              >
                <span className={`font-bold text-[11px] sm:text-xs leading-none ${isPresent ? "text-emerald-900 dark:text-emerald-200" : ""}`}>
                  {dayNum}
                </span>

                {isPresent && (
                  <div className="space-y-0.5 mt-auto pt-0.5">
                    <div className="text-[7.5px] sm:text-[9px] font-mono font-extrabold text-emerald-700 dark:text-emerald-400 truncate leading-tight">
                      {att.punchInTime}
                    </div>
                    {isOtApproved && (
                      <span className="text-[7px] sm:text-[8px] bg-blue-600 text-white px-0.5 rounded-xs font-bold block text-center leading-tight">
                        +OT
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] sm:text-[11px] pt-3 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
            <span>Overtime Approved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
            <span>No Punch</span>
          </div>
        </div>
      </div>
    </div>
  );
};
