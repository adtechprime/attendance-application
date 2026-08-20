import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Building2,
  Shield,
  UserCheck,
  KeyRound,
  ArrowRight,
  HardHat,
  Sparkles,
  UserPlus,
  Lock,
  Smartphone,
} from "lucide-react";

export const AuthScreen = ({ onLoginSuccess }) => {
  const { company, employees, setCurrentRole, setCurrentEmployeeId } = useApp();
  const [selectedPortal, setSelectedPortal] = useState("superadmin");
  const [employeeCodeInput, setEmployeeCodeInput] = useState("");
  const [superadminPin, setSuperadminPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSuperadminLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");
    const enteredPin = superadminPin.trim();
    const correctPin = String(company.adminPin || "1234").trim();

    if (!enteredPin) {
      setErrorMsg("Please enter the 4-digit Contractor Passcode / PIN.");
      return;
    }

    if (enteredPin === correctPin) {
      setCurrentRole("superadmin");
      onLoginSuccess();
    } else {
      setErrorMsg("Incorrect 4-digit PIN. Please enter the valid contractor security passcode.");
    }
  };

  const handleLabourLoginByCode = (e) => {
    e.preventDefault();
    setErrorMsg("");
    const code = employeeCodeInput.trim();
    const matched = employees.find((emp) => emp.employeeCode === code);

    if (matched) {
      setCurrentRole("labour");
      setCurrentEmployeeId(matched.id);
      onLoginSuccess();
    } else {
      setErrorMsg(`Invalid 4-digit Code "${code}". Please enter your registered employee code.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full app-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl border-2 border-blue-600 dark:border-blue-500">
        {/* Company Branding Header */}
        <div className="text-center space-y-2">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-600 shadow-lg mx-auto bg-white p-1"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-lg mx-auto">
              <Building2 className="w-9 h-9" />
            </div>
          )}
          <h1 className="font-black text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
            {company.name}
          </h1>
          <p className="text-xs text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider">
            Contractor Workforce & Attendance System
          </p>
          {(company.licenceNo || company.contractorCode) && (
            <p className="text-[10px] text-slate-500 font-mono">
              Lic: {company.licenceNo || company.contractorCode} • GST: {company.gstNo || "27AAACA1234A1Z5"}
            </p>
          )}
        </div>

        {/* Portal Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-200 dark:bg-slate-900 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setSelectedPortal("superadmin");
              setErrorMsg("");
            }}
            className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              selectedPortal === "superadmin"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Superadmin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedPortal("labour");
              setErrorMsg("");
            }}
            className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              selectedPortal === "labour"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Labour Portal</span>
          </button>
        </div>

        {/* SUPERADMIN PIN LOGIN */}
        {selectedPortal === "superadmin" && (
          <form onSubmit={handleSuperadminLogin} className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5 mb-1">
                <HardHat className="w-4 h-4" /> Contractor Control Center
              </div>
              Full administrative access to manage workers, site rosters, overtime approvals, expenses, and salary books.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Contractor Passcode / PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter 4-digit PIN (Default: 1234)"
                  value={superadminPin}
                  onChange={(e) => setSuperadminPin(e.target.value)}
                  className="w-full app-input pl-10 pr-4 py-3 rounded-xl text-sm font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 btn-touch transition-all"
            >
              <span>Enter Superadmin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* LABOUR 4-DIGIT CODE LOGIN */}
        {selectedPortal === "labour" && (
          <div className="space-y-4 animate-in fade-in">
            {employees.length === 0 ? (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <UserPlus className="w-8 h-8 text-blue-600 mx-auto" />
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  No Labour Profiles Enrolled Yet
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Log in as <strong>Superadmin</strong> first to enroll workers and generate their 4-digit Employee Codes.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedPortal("superadmin")}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
                >
                  Go to Superadmin Portal
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleLabourLoginByCode} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-center">
                      Enter 4-Digit Employee Code
                    </label>
                    <input
                      type="text"
                      maxLength="4"
                      required
                      placeholder="e.g. 1024"
                      value={employeeCodeInput}
                      onChange={(e) => setEmployeeCodeInput(e.target.value)}
                      className="w-full app-input p-3.5 rounded-2xl font-mono text-2xl tracking-widest text-center text-blue-600 dark:text-blue-400 font-black border-2"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 btn-touch transition-all cursor-pointer"
                  >
                    <span>Login to Labour Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
