import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Building2,
  Bell,
  LogOut,
  Moon,
  Sun,
  Shield,
  UserCheck,
  RotateCcw,
  Settings,
} from "lucide-react";

export const Header = ({ onToggleNotifications, onLogout, onNavigateTab }) => {
  const { currentRole, activeEmployee, company, theme, toggleTheme, notifications, clearAllData, showToast } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all data and reset to a clean state?")) {
      clearAllData();
      showToast("Database reset to clean state.", "info");
    }
  };

  const licenceDisplay = company.licenceNo || company.contractorCode || "LIC-CIVIL-MH-2026";

  return (
    <header className="sticky top-0 z-40 app-panel border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Branding -> Logo on Left, Company Name & Licence on Right */}
        <div
          onClick={() => {
            if (currentRole === "superadmin" && onNavigateTab) {
              onNavigateTab("profile");
            }
          }}
          className={`flex items-center gap-3 ${
            currentRole === "superadmin" ? "cursor-pointer group" : ""
          }`}
          title={currentRole === "superadmin" ? "Click to view/edit Organization Profile & PIN" : undefined}
        >
          {/* Logo on Left */}
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-10 h-10 rounded-2xl object-contain bg-white border-2 border-blue-600 shadow-md shrink-0 p-0.5 group-hover:scale-105 transition-all"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shrink-0 group-hover:bg-blue-700 transition-all">
              <Building2 className="w-5 h-5" />
            </div>
          )}

          {/* Company Name & Licence on Right (No "Contractor" badge) */}
          <div className="min-w-0">
            <h1 className="font-extrabold text-xs sm:text-base text-slate-900 dark:text-slate-100 tracking-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none group-hover:text-blue-600 transition-colors leading-tight">
              {company.name}
            </h1>
            <p className="text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold truncate leading-tight pt-0.5 max-w-[130px] xs:max-w-[180px] sm:max-w-none">
              Lic: {licenceDisplay} {company.gstNo ? `• GST: ${company.gstNo}` : ""}
            </p>
          </div>
        </div>

        {/* Right: Theme Toggle, Profile Settings, Alerts & Logout */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Superadmin Organization Profile & Security Button */}
          {currentRole === "superadmin" && (
            <button
              onClick={() => onNavigateTab && onNavigateTab("profile")}
              title="Organization Profile & Security Settings"
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-600 transition-all cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-bold"
            >
              <Settings className="w-4 h-4 text-blue-600" />
              <span>Profile</span>
            </button>
          )}

          {/* Superadmin Notification Bell */}
          {currentRole === "superadmin" && (
            <button
              onClick={onToggleNotifications}
              className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Superadmin Clear Data Tool */}
          {currentRole === "superadmin" && (
            <button
              onClick={handleClearAll}
              title="Reset Database to Clean State"
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition-all hidden sm:flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
