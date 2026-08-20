import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Users,
  Clock,
  Zap,
  Wallet,
  Building2,
  AlertTriangle,
  UserPlus,
  CheckCircle2,
  Camera,
  MapPin,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const SuperadminDashboard = ({ onNavigateTab, onSelectEmployeeProfile }) => {
  const { employees, attendance, expenses, projects, approveOvertime } = useApp();

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter((a) => a.date === today);
  const presentCount = todayAttendance.filter((a) => a.status === "present" || a.status === "late").length;
  const lateCount = todayAttendance.filter((a) => a.status === "late").length;

  const pendingOt = attendance.filter((a) => a.overtimeStatus === "pending");
  const totalEmployeesCount = employees.length;

  const totalSiteExpenses = expenses
    .filter((e) => e.transferType === "official_expense")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalAdvances = expenses
    .filter((e) => e.transferType === "private_advance")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Top Banner / Welcome */}
      <div className="app-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800">
              Superadmin Overview
            </span>
            <span className="text-xs text-slate-500">
              Live Date: {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Labour Workforce Command Center
          </h2>
          <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Monitor real-time site punch-ins with live selfies, GPS tags, overtime authorization queue, and money transfers.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Labour */}
        <div className="app-card p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Labour</span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">{totalEmployeesCount}</div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <span className="text-emerald-600 font-bold">{employees.filter((e) => e.status === "active").length} Active</span>
            <span>•</span>
            <span>{employees.filter((e) => e.status === "inactive").length} Inactive</span>
          </div>
        </div>

        {/* Present Today */}
        <div className="app-card p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Present Today</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
            {presentCount} <span className="text-sm font-normal text-slate-400">/ {totalEmployeesCount}</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <span className="text-emerald-600 font-bold">{presentCount - lateCount} On-Time</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">{lateCount} Late</span>
          </div>
        </div>

        {/* Pending OT Approvals */}
        <div className="app-card p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pending OT Requests</span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{pendingOt.length}</div>
          <div className="text-xs text-slate-500">Awaiting Contractor approval</div>
        </div>

        {/* Total Advances Handed */}
        <div className="app-card p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Advances Distributed</span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
            ₹{totalAdvances.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-500">Debited from worker salaries</div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Punch Activity Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-lg">Today's Live Punch Feed</h3>
              <p className="text-xs text-slate-500">Geo-tagged punches with live selfies captured today</p>
            </div>
            <button
              onClick={() => onNavigateTab("attendance")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
            >
              <span>View Full Log</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {todayAttendance.length === 0 ? (
              <div className="app-card p-8 rounded-3xl text-center text-slate-400 text-xs">
                No punches recorded yet today. When workers punch in, their photos and GPS tags will appear here.
              </div>
            ) : (
              todayAttendance.map((att) => {
                const emp = employees.find((e) => e.id === att.employeeId);
                const proj = projects.find((p) => p.id === att.projectId);

                return (
                  <div
                    key={att.id}
                    className="app-card p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={att.punchInSelfie || emp?.avatar}
                        alt={emp?.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-600 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            onClick={() => onSelectEmployeeProfile(emp?.id)}
                            className="font-extrabold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 cursor-pointer"
                          >
                            {emp?.name}
                          </h4>
                          <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-blue-200 dark:border-slate-700">
                            EMP-{emp?.employeeCode}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{att.siteName || proj?.name}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                      <div className="text-right text-xs">
                        <div>
                          In: <strong className="text-emerald-600 font-bold">{att.punchInTime}</strong>
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          Out: {att.punchOutTime ? <strong className="text-blue-600">{att.punchOutTime}</strong> : "On Duty"}
                        </div>
                      </div>

                      {att.overtimeStatus === "pending" && (
                        <button
                          onClick={() => approveOvertime(att.id)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                        >
                          Approve OT
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Overtime Approvals & Sites Summary */}
        <div className="space-y-6">
          {/* Overtime Queue Widget */}
          <div className="app-card p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Overtime Queue</h3>
              </div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                {pendingOt.length} Pending
              </span>
            </div>

            {pendingOt.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No pending overtime approvals.</p>
            ) : (
              <div className="space-y-2">
                {pendingOt.slice(0, 3).map((ot) => {
                  const emp = employees.find((e) => e.id === ot.employeeId);
                  return (
                    <div
                      key={ot.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{emp?.name}</div>
                        <div className="text-[10px] text-slate-500">{ot.date}</div>
                      </div>
                      <button
                        onClick={() => approveOvertime(ot.id)}
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        Approve
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Projects Quick Summary */}
          <div className="app-card p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Active Sites</h3>
              </div>
              <button
                onClick={() => onNavigateTab("projects")}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Manage Sites
              </button>
            </div>

            <div className="space-y-2.5">
              {projects.map((proj) => {
                const assignedCount = employees.filter((e) => e.assignedProjectId === proj.id).length;
                return (
                  <div
                    key={proj.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{proj.name}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{proj.locationName}</div>
                    </div>
                    <span className="font-bold text-blue-600 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-slate-700">
                      {assignedCount} Workers
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
