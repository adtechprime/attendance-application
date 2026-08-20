import React from "react";
import { useApp } from "../../context/AppContext";
import { Zap, Clock, CheckCircle2, AlertCircle, Building2, Calendar } from "lucide-react";

export const LabourOvertimeView = () => {
  const { activeEmployee, attendance, projects } = useApp();

  // Filter attendance records where overtime was logged (either pending or approved or overtimeHours > 0)
  const empOtRecords = attendance.filter(
    (a) =>
      a.employeeId === activeEmployee?.id &&
      (a.overtimeStatus === "approved" || a.overtimeStatus === "pending" || a.overtimeHours > 0)
  );

  const approvedRecords = empOtRecords.filter((a) => a.overtimeStatus === "approved");
  const pendingRecords = empOtRecords.filter((a) => a.overtimeStatus === "pending");

  // Format overtime duration in Hours, Minutes, Seconds
  const formatOtDuration = (record) => {
    if (record.overtimeSeconds && record.overtimeSeconds > 0) {
      const hrs = Math.floor(record.overtimeSeconds / 3600);
      const mins = Math.floor((record.overtimeSeconds % 3600) / 60);
      const secs = record.overtimeSeconds % 60;
      return `${hrs}h ${mins}m ${secs}s`;
    }

    if (record.overtimeHours) {
      const hrs = Math.floor(record.overtimeHours);
      const mins = Math.round((record.overtimeHours - hrs) * 60);
      return `${hrs}h ${mins}m 00s`;
    }

    return "2h 30m 00s"; // Default standard overtime shift block
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-6">
      {/* Header Metric Cards */}
      <div className="app-panel p-5 rounded-3xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Extra Duty Ledger
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Overtime Records</h2>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Approved OT Shifts</div>
            <div className="text-2xl font-black text-emerald-800 dark:text-emerald-200 mt-0.5">
              {approvedRecords.length} Days
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ● +50% Daily Pay Added
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400">Pending Review</div>
            <div className="text-2xl font-black text-amber-800 dark:text-amber-200 mt-0.5">
              {pendingRecords.length} Days
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
              ● Contractor Review
            </div>
          </div>
        </div>
      </div>

      {/* Approved Overtime List */}
      <div className="app-card p-4 rounded-3xl space-y-3">
        <h3 className="text-xs font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Approved Overtime Log (Verified Pay Added)
        </h3>

        {approvedRecords.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            No approved overtime records yet. Once Contractor approves your OT, it will appear here with exact hours/minutes.
          </div>
        ) : (
          <div className="space-y-2.5">
            {approvedRecords.map((rec) => {
              const proj = projects.find((p) => p.id === rec.projectId);
              return (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{rec.date}</span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700">
                      ✓ OT Approved
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate max-w-[200px]">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.siteName || proj?.name}</span>
                    </div>

                    <div className="font-mono font-black text-blue-700 dark:text-blue-400">
                      Duration: {formatOtDuration(rec)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Overtime Queue */}
      {pendingRecords.length > 0 && (
        <div className="app-card p-4 rounded-3xl space-y-3">
          <h3 className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            Pending Contractor Approvals ({pendingRecords.length})
          </h3>

          <div className="space-y-2">
            {pendingRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{rec.date}</div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400">Awaiting Contractor approval</div>
                </div>
                <div className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {formatOtDuration(rec)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
