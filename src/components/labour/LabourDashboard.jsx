import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Clock,
  Camera,
  MapPin,
  Calendar,
  Wallet,
  CheckSquare,
  FileText,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { calculateEmployeeSalaryLedger } from "../../utils/calculations";

export const LabourDashboard = ({ onNavigateTab }) => {
  const { activeEmployee, attendance, projects, tasks, expenses } = useApp();

  const today = new Date().toISOString().split("T")[0];
  const todayAtt = attendance.find((a) => a.employeeId === activeEmployee?.id && a.date === today);
  const myTasks = tasks.filter((t) => t.assignedToId === activeEmployee?.id);
  const myExpenses = expenses.filter((e) => e.employeeId === activeEmployee?.id);
  const myAttList = attendance.filter((a) => a.employeeId === activeEmployee?.id);

  const assignedProject = projects.find((p) => p.id === activeEmployee?.assignedProjectId);
  const ledger = calculateEmployeeSalaryLedger(activeEmployee, myAttList, myExpenses);

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeEmployee?.avatar}
            alt={activeEmployee?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-100">{activeEmployee?.name}</h2>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                EMP-{activeEmployee?.employeeCode}
              </span>
            </div>
            <p className="text-xs font-bold text-amber-400 mt-0.5">{activeEmployee?.designation}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Assigned Site: <strong>{assignedProject?.name || "General Site"}</strong></span>
            </p>
          </div>
        </div>

        {/* Punch In / Out Quick CTA */}
        <button
          onClick={() => onNavigateTab("labour_punch")}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all self-start md:self-auto"
        >
          <Camera className="w-5 h-5" />
          <span>{todayAtt ? (todayAtt.punchOutTime ? "View Today's Punch" : "Punch Out Now") : "Punch In Duty Now"}</span>
        </button>
      </div>

      {/* Today's Status Banner */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Today's Attendance Status</span>
          <div className="flex items-center gap-3 mt-1">
            {todayAtt ? (
              <span className="text-lg font-extrabold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5" />
                <span>Punched In at {todayAtt.punchInTime}</span>
              </span>
            ) : (
              <span className="text-lg font-extrabold text-amber-400">Not Punched In Yet</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">Standard Shift: 10:00 AM – 6:00 PM (Site Geofenced)</p>
        </div>

        {todayAtt && (
          <div className="text-right text-xs font-mono">
            <span className="text-slate-400 block">Working Hours Today</span>
            <span className="text-xl font-extrabold text-slate-100">{todayAtt.workingHours} hrs</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div
          onClick={() => onNavigateTab("labour_attendance")}
          className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold">Worked Days This Month</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-2">{ledger.presentDaysCount} Days</div>
        </div>

        <div
          onClick={() => onNavigateTab("labour_salary")}
          className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold">Earned Salary Balance</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-2">₹{ledger.netPayable}</div>
        </div>

        <div
          onClick={() => onNavigateTab("labour_tasks")}
          className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold">Assigned Tasks</span>
            <CheckSquare className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-2">{myTasks.length} Pending</div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => onNavigateTab("labour_daily_report")}
          className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">Submit Daily Work Report</h4>
              <p className="text-xs text-slate-400 mt-0.5">Required before/after logging out today</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400" />
        </div>

        <div
          onClick={() => onNavigateTab("labour_expenses")}
          className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">Submit Expense Voucher</h4>
              <p className="text-xs text-slate-400 mt-0.5">Attach bill photo for site reimbursement</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
