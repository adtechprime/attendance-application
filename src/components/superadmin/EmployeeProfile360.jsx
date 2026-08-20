import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Receipt,
  Wallet,
  CheckSquare,
  FileText,
  CreditCard,
  Building2,
  Phone,
  HardHat,
  Ban,
  ShieldCheck,
  Printer,
} from "lucide-react";
import { calculateEmployeeSalaryLedger } from "../../utils/calculations";

export const EmployeeProfile360 = ({ employeeId, onBack }) => {
  const { employees, attendance, expenses, projects, groups, payments } = useApp();
  const [activeTab, setActiveTab] = useState("attendance"); // 'attendance' | 'expenses' | 'salary'

  const employee = employees.find((e) => e.id === employeeId) || employees[0];
  if (!employee) return null;

  const assignedProject = projects.find((p) => p.id === employee.assignedProjectId);
  const assignedGroup = groups.find((g) => g.id === employee.assignedGroupId);

  const empAttendance = attendance.filter((a) => a.employeeId === employee.id);
  const empExpenses = expenses.filter((e) => e.employeeId === employee.id);
  const empPayments = payments.filter((p) => p.employeeId === employee.id);

  const ledger = calculateEmployeeSalaryLedger(employee, empAttendance, empExpenses, empPayments);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl app-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-2 transition-all btn-touch"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="app-panel p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-600 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">{employee.name}</h2>
              <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-200 dark:border-slate-700">
                EMP-{employee.employeeCode}
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">{employee.designation}</p>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
              <span>Govt ID: {employee.govtIdType || "Aadhaar"} ({employee.govtIdNumber || "Verified"})</span>
              <span>•</span>
              <span>Phone: {employee.mobile || "—"}</span>
            </div>
          </div>
        </div>

        <div className="text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-semibold">Net Salary Balance</div>
          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
            ₹{ledger.netPayable.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 max-w-md p-1 rounded-2xl bg-slate-200 dark:bg-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab("attendance")}
          className={`py-2 rounded-xl transition-all ${
            activeTab === "attendance" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          Punches ({empAttendance.length})
        </button>
        <button
          onClick={() => setActiveTab("expenses")}
          className={`py-2 rounded-xl transition-all ${
            activeTab === "expenses" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          Transfers ({empExpenses.length})
        </button>
        <button
          onClick={() => setActiveTab("salary")}
          className={`py-2 rounded-xl transition-all ${
            activeTab === "salary" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          Salary Ledger
        </button>
      </div>

      {/* TAB CONTENT: ATTENDANCE */}
      {activeTab === "attendance" && (
        <div className="app-card rounded-3xl overflow-hidden p-5 space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Attendance History</h3>
          {empAttendance.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No attendance punches recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {empAttendance.map((att) => (
                <div
                  key={att.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{att.date}</div>
                      <div className="text-[10px] text-slate-500">Site: {att.siteName}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-600">In: {att.punchInTime}</div>
                    <div className="text-slate-500">Out: {att.punchOutTime || "On Duty"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: EXPENSES & TRANSFERS */}
      {activeTab === "expenses" && (
        <div className="app-card rounded-3xl overflow-hidden p-5 space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Money Transfers & Advances</h3>
          {empExpenses.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No money transfer records found.</p>
          ) : (
            <div className="space-y-2.5">
              {empExpenses.map((trx) => (
                <div
                  key={trx.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{trx.purpose}</div>
                    <div className="text-[10px] text-slate-500">{trx.date} • {trx.transferType}</div>
                  </div>

                  <div className="text-right font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                    ₹{Number(trx.amount).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SALARY */}
      {activeTab === "salary" && (
        <div className="app-card rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Monthly Wage Breakdown</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-slate-500 font-semibold">Worked Days</div>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">{ledger.workedDays} Days</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-slate-500 font-semibold">Base Earnings</div>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">₹{ledger.baseSalary}</div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="text-emerald-700 dark:text-emerald-400 font-semibold">Approved OT Bonus</div>
              <div className="text-lg font-black text-emerald-800 dark:text-emerald-300 mt-1">+₹{ledger.otBonus}</div>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <div className="text-rose-700 dark:text-rose-400 font-semibold">Advance Deductions</div>
              <div className="text-lg font-black text-rose-800 dark:text-rose-300 mt-1">-₹{ledger.totalAdvances}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
