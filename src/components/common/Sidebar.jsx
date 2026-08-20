import React from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard,
  Users,
  Clock,
  Zap,
  Wallet,
  Building2,
  Calendar,
  CreditCard,
  UserCheck,
  Briefcase,
  ChevronRight,
} from "lucide-react";

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { currentRole, activeEmployee, attendance } = useApp();

  const pendingOtCount = attendance.filter((a) => a.overtimeStatus === "pending").length;

  const superadminNav = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "employees", label: "Labour Workforce", icon: Users },
    { id: "attendance", label: "Live Punch Monitor", icon: Clock },
    { id: "overtime", label: "Overtime Approvals", icon: Zap, badge: pendingOtCount },
    { id: "expenses", label: "Money & Site Expenses", icon: Wallet },
    { id: "projects", label: "Sites & Trade Teams", icon: Building2 },
    { id: "salary", label: "Master Salary Book", icon: CreditCard },
    { id: "profile", label: "Company & Security", icon: UserCheck },
  ];

  const labourNav = [
    { id: "labour_punch", label: "Duty Punch Station", icon: Clock },
    { id: "labour_attendance", label: "Attendance Calendar", icon: Calendar },
    { id: "labour_transfers", label: "Money & Transfers", icon: Wallet },
    { id: "labour_overtime", label: "My Overtime Log", icon: Zap },
    { id: "labour_idcard", label: "Employee ID Card", icon: UserCheck },
  ];

  const items = currentRole === "superadmin" ? superadminNav : labourNav;

  return (
    <aside className="hidden md:flex flex-col w-64 app-panel border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 shrink-0 transition-colors">
      <div className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider px-3">
        {currentRole === "superadmin" ? "Contractor Menu" : "Worker Navigation"}
      </div>

      <nav className="space-y-1.5 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
                <span>{item.label}</span>
              </div>

              {item.badge > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Active Worker Profile Chip (in Labour mode) */}
      {currentRole === "labour" && activeEmployee && (
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 flex items-center gap-3">
          <img
            src={activeEmployee.avatar}
            alt={activeEmployee.name}
            className="w-10 h-10 rounded-xl object-cover border border-blue-600"
          />
          <div className="min-w-0">
            <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
              {activeEmployee.name}
            </div>
            <div className="text-[10px] font-mono text-blue-700 dark:text-blue-400">
              EMP-{activeEmployee.employeeCode}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
