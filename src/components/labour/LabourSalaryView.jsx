import React from "react";
import { useApp } from "../../context/AppContext";
import { Wallet, DollarSign, Calendar, ShieldCheck, CreditCard } from "lucide-react";
import { calculateEmployeeSalaryLedger } from "../../utils/calculations";

export const LabourSalaryView = () => {
  const { activeEmployee, attendance, expenses, payments } = useApp();

  const myAtt = attendance.filter((a) => a.employeeId === activeEmployee?.id);
  const myExp = expenses.filter((e) => e.employeeId === activeEmployee?.id);
  const myPay = payments.filter((p) => p.employeeId === activeEmployee?.id);

  const ledger = calculateEmployeeSalaryLedger(activeEmployee, myAtt, myExp);
  const totalPaid = myPay.reduce((sum, p) => sum + p.amount, 0);
  const pendingBalance = Math.max(0, ledger.netPayable - totalPaid);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="app-panel p-6 rounded-3xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              My Salary Ledger & Earnings
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Personal salary book, worked days breakdown, advance deductions, and payment records.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">My Daily Salary Rate</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">₹{activeEmployee?.dailySalary || activeEmployee?.salary} / day</div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="app-card p-5 rounded-2xl">
          <span className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Base Wages Earned</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">₹{ledger.baseEarnings}</span>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{ledger.presentDaysCount} Worked Days</div>
        </div>

        <div className="app-card p-5 rounded-2xl">
          <span className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Approved Overtime Wages</span>
          <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">+ ₹{ledger.otEarnings}</span>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">{ledger.approvedOtPeriods} Approved OT Periods</div>
        </div>

        <div className="app-card p-5 rounded-2xl">
          <span className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Personal Advances Deducted</span>
          <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">- ₹{ledger.personalAdvancesTotal}</span>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Medical/cash advances</div>
        </div>

        <div className="app-card p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <span className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Net Payable Balance</span>
          <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">₹{ledger.netPayable}</span>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">Paid: ₹{totalPaid} • Pending: ₹{pendingBalance}</div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="app-panel p-5 rounded-2xl space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Payment Handover History</h3>
        {myPay.length === 0 ? (
          <div className="text-slate-500 dark:text-slate-400 text-xs py-6 text-center">No payment transactions recorded yet.</div>
        ) : (
          <div className="space-y-2">
            {myPay.map((p) => (
              <div key={p.id} className="app-card p-3.5 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{p.mode} Handover</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Ref: {p.ref} • Date: {p.date}</div>
                </div>
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">₹{p.amount}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
