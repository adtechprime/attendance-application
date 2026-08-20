import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Camera,
  Calendar,
  Wallet,
  Zap,
  CreditCard,
  LayoutDashboard,
  Users,
  Clock,
  Building2,
  Settings,
  MoreHorizontal,
  X,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

export const MobileNav = ({ activeTab, setActiveTab }) => {
  const { currentRole, attendance } = useApp();
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const pendingOtCount = attendance.filter((a) => a.overtimeStatus === "pending").length;

  // Tabs for Labour
  const labourNavItems = [
    { id: "labour_punch", label: "Punch", icon: Camera },
    { id: "labour_attendance", label: "Calendar", icon: Calendar },
    { id: "labour_transfers", label: "Transfers", icon: Wallet },
    { id: "labour_overtime", label: "Overtime", icon: Zap },
    { id: "labour_idcard", label: "ID Card", icon: UserCheck },
  ];

  // Primary 4 Tabs for Superadmin + "More"
  const superadminPrimaryItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "employees", label: "Labour", icon: Users },
    { id: "attendance", label: "Punches", icon: Clock },
    { id: "salary", label: "Salary", icon: CreditCard },
  ];

  // Drawer options for Superadmin
  const superadminMoreItems = [
    { id: "projects", label: "Sites & Squads", icon: Building2, desc: "Manage sites, GPS geofences & teams" },
    { id: "expenses", label: "Finance & Advances", icon: Wallet, desc: "Log advances & site expenses" },
    { id: "overtime", label: "Overtime Queue", icon: Zap, badge: pendingOtCount, desc: "Approve or reject extra work" },
    { id: "profile", label: "Organization & PIN", icon: Settings, desc: "Company branding & security PIN" },
  ];

  const isMoreActive = superadminMoreItems.some((item) => item.id === activeTab);

  if (currentRole === "labour") {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 app-panel border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-2 py-1.5">
        <div className="flex items-center justify-around">
          {labourNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all relative btn-touch cursor-pointer ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-extrabold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                </div>
                <span className="text-[10px] tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 -mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Superadmin Mobile Navigation
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 app-panel border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-2 py-1.5">
        <div className="flex items-center justify-around">
          {superadminPrimaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setShowMoreDrawer(false);
                  setActiveTab(item.id);
                }}
                className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all relative btn-touch cursor-pointer ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-extrabold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                </div>
                <span className="text-[10px] tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 -mt-0.5" />
                )}
              </button>
            );
          })}

          {/* More Menu Button */}
          <button
            onClick={() => setShowMoreDrawer(!showMoreDrawer)}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all relative btn-touch cursor-pointer ${
              isMoreActive || showMoreDrawer
                ? "text-blue-600 dark:text-blue-400 font-extrabold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
            }`}
          >
            <div className="relative">
              <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
              {pendingOtCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {pendingOtCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">More</span>
            {(isMoreActive || showMoreDrawer) && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 -mt-0.5" />
            )}
          </button>
        </div>
      </nav>

      {/* Superadmin Slide-Up Bottom Sheet Drawer */}
      {showMoreDrawer && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowMoreDrawer(false)}
        >
          <div
            className="app-panel rounded-t-3xl p-5 space-y-4 shadow-2xl border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Superadmin Modules</h3>
                  <p className="text-[11px] text-slate-500">Quick access to all contractor tools</p>
                </div>
              </div>

              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {superadminMoreItems.map((item) => {
                const Icon = item.icon;
                const isItemActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMoreDrawer(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer ${
                      isItemActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isItemActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div
                          className={`text-xs font-bold ${
                            isItemActive ? "text-white" : "text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div
                          className={`text-[10.5px] ${
                            isItemActive ? "text-blue-100" : "text-slate-500"
                          }`}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    {item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

