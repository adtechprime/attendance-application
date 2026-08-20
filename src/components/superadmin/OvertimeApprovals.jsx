import React from "react";
import { useApp } from "../../context/AppContext";
import { Zap, CheckCircle2, XCircle, Clock, Building2, UserCheck, Calendar, AlertCircle } from "lucide-react";

export const OvertimeApprovals = () => {
  const { attendance, employees, projects, approveOvertime, rejectOvertime } = useApp();

  const pendingOt = attendance.filter((a) => a.overtimeStatus === "pending");
  const approvedOt = attendance.filter((a) => a.overtimeStatus === "approved");

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
    return "2h 30m";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* Header Panel */}
      <div className="app-panel p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            Overtime Authorization
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Overtime Approvals Queue
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review and approve extra working hours. Approved overtime adds a +50% Daily Wage bonus to the employee's salary book.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-300 dark:border-amber-700">
            {pendingOt.length} Pending Approvals
          </div>
        </div>
      </div>

      {/* Pending Queue */}
      <div className="app-card p-5 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Pending Requests ({pendingOt.length})</span>
          </h3>
        </div>

        {pendingOt.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No pending overtime requests requiring approval at this time.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOt.map((ot) => {
              const emp = employees.find((e) => e.id === ot.employeeId);
              const proj = projects.find((p) => p.id === ot.projectId);
              const otBonus = (Number(emp?.salary || 600) * 0.5).toFixed(0);

              return (
                <div
                  key={ot.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={emp?.avatar}
                      alt={emp?.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{emp?.name}</h4>
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-200 dark:border-slate-700">
                          EMP-{emp?.employeeCode}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{ot.date}</span>
                        <span>•</span>
                        <span>Site: {ot.siteName || proj?.name}</span>
                      </div>
                      <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-1">
                        Overtime Duration: {formatOtDuration(ot)} • Pay Bonus: +₹{otBonus}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => rejectOvertime(ot.id)}
                      className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs transition-all btn-touch"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveOvertime(ot.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md btn-touch"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve OT (+₹{otBonus})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recently Approved Overtime Log */}
      {approvedOt.length > 0 && (
        <div className="app-card p-5 rounded-3xl space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
            Approved Overtime History ({approvedOt.length})
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {approvedOt.map((ot) => {
              const emp = employees.find((e) => e.id === ot.employeeId);
              return (
                <div
                  key={ot.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{emp?.name}</span>
                      <span className="text-slate-400 ml-2 font-mono">{ot.date}</span>
                    </div>
                  </div>

                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    ✓ {formatOtDuration(ot)} Approved
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
