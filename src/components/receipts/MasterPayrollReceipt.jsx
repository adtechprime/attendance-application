import React from "react";
import { useApp } from "../../context/AppContext";
import { numberToIndianWords, formatIndianDate } from "../../utils/formatters";
import { calculateEmployeeSalaryLedger } from "../../utils/calculations";

export const MasterPayrollReceipt = () => {
  const { company, employees, attendance, expenses, payments } = useApp();

  let totalWorkforceBase = 0;
  let totalWorkforceOt = 0;
  let totalWorkforceAdvances = 0;
  let totalWorkforcePaid = 0;
  let totalWorkforceNetPayable = 0;

  const rows = employees.map((emp) => {
    const empAtt = attendance.filter((a) => a.employeeId === emp.id);
    const empExp = expenses.filter((e) => e.employeeId === emp.id);
    const empPay = payments.filter((p) => p.employeeId === emp.id);
    const ledger = calculateEmployeeSalaryLedger(emp, empAtt, empExp, empPay);

    totalWorkforceBase += ledger.baseEarnings;
    totalWorkforceOt += ledger.otBonus;
    totalWorkforceAdvances += ledger.personalAdvancesTotal;
    totalWorkforcePaid += ledger.totalPaidOut;
    totalWorkforceNetPayable += ledger.netPayable;

    return {
      emp,
      ledger,
    };
  });

  return (
    <div className="space-y-5 text-slate-900 font-sans leading-relaxed">
      {/* ─────────────────────────────────────────────────────────
          1. CORPORATE LETTERHEAD HEADER
      ───────────────────────────────────────────────────────── */}
      <div className="border-b-2 border-slate-900 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {company.logo && (
              <img
                src={company.logo}
                alt={company.name}
                className="w-14 h-14 rounded-xl object-contain border border-slate-300 p-1 shrink-0 bg-white"
              />
            )}
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-blue-900 leading-tight">
                {company.name}
              </h1>
              <p className="text-xs font-bold text-slate-700">
                Government Licensed Civil & Infrastructure Contractors
              </p>
              <div className="text-[11px] text-slate-600 space-y-0.5 pt-0.5">
                <div>
                  <strong>Office:</strong> {company.address}
                </div>
                <div>
                  <strong>GSTIN:</strong> {company.gstNo} • <strong>Lic No:</strong> {company.licenceNo || company.contractorCode}
                </div>
                <div>
                  <strong>Helpline:</strong> {company.phone || company.contractorMobile}
                </div>
              </div>
            </div>
          </div>

          <div className="text-right border-2 border-slate-900 p-3 rounded-xl bg-slate-50 min-w-[210px] shrink-0">
            <div className="text-[10px] font-black uppercase tracking-wider text-blue-900">
              Master Payroll Register
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">
              Date: {formatIndianDate(new Date().toISOString())}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Contractor: <strong>{company.contractorName}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          2. SUMMARY STATS (4-COLUMN GRID)
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 divide-x divide-slate-300 border border-slate-300 rounded-xl bg-slate-50 text-center p-3 text-xs">
        <div className="px-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Workforce</span>
          <div className="text-base font-black text-slate-900 mt-0.5">{employees.length} Workers</div>
        </div>
        <div className="px-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Gross Earned Wages</span>
          <div className="text-base font-black text-blue-900 mt-0.5 whitespace-nowrap">
            ₹{(totalWorkforceBase + totalWorkforceOt).toLocaleString("en-IN")}
          </div>
        </div>
        <div className="px-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Advances Debited</span>
          <div className="text-base font-black text-rose-700 mt-0.5 whitespace-nowrap">
            -₹{totalWorkforceAdvances.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="px-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Net Payroll Liability</span>
          <div className="text-base font-black text-indigo-900 mt-0.5 whitespace-nowrap">
            ₹{totalWorkforceNetPayable.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          3. MASTER PAYROLL TABLE (FIXED COLUMNS & BORDERS)
      ───────────────────────────────────────────────────────── */}
      <div className="border border-slate-300 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[9.5px]">
              <th className="p-2.5 border-r border-slate-300 w-10 text-center">Sr.</th>
              <th className="p-2.5 border-r border-slate-300 w-44">Labour Name & Code</th>
              <th className="p-2.5 border-r border-slate-300 w-20 text-right">Daily Rate</th>
              <th className="p-2.5 border-r border-slate-300 w-24 text-center">Duty Days</th>
              <th className="p-2.5 border-r border-slate-300 w-24 text-right">Basic Wages</th>
              <th className="p-2.5 border-r border-slate-300 w-20 text-right text-emerald-700">OT Bonus</th>
              <th className="p-2.5 border-r border-slate-300 w-20 text-right text-rose-700">Advances</th>
              <th className="p-2.5 text-right w-24 text-blue-900 font-black">Net Payable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map(({ emp, ledger }, idx) => (
              <tr key={emp.id} className="hover:bg-slate-50">
                <td className="p-2.5 border-r border-slate-300 text-center font-mono font-bold text-slate-500">
                  {idx + 1}
                </td>

                <td className="p-2.5 border-r border-slate-300 truncate">
                  <div className="font-extrabold text-slate-900 truncate">{emp.name}</div>
                  <div className="text-[10px] font-mono text-blue-900 font-bold truncate">
                    EMP-{emp.employeeCode} • {emp.designation}
                  </div>
                </td>

                <td className="p-2.5 border-r border-slate-300 text-right font-mono font-bold whitespace-nowrap">
                  ₹{Number(emp.salary || 600).toLocaleString("en-IN")}
                </td>

                <td className="p-2.5 border-r border-slate-300 text-center font-bold whitespace-nowrap text-[11px]">
                  {ledger.presentDaysCount}P {ledger.halfDaysCount > 0 ? `+ ${ledger.halfDaysCount}HD` : ""}
                </td>

                <td className="p-2.5 border-r border-slate-300 text-right font-mono font-bold whitespace-nowrap">
                  ₹{ledger.baseEarnings.toLocaleString("en-IN")}
                </td>

                <td className="p-2.5 border-r border-slate-300 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                  +₹{ledger.otBonus.toLocaleString("en-IN")}
                </td>

                <td className="p-2.5 border-r border-slate-300 text-right font-mono font-bold text-rose-700 whitespace-nowrap">
                  -₹{ledger.personalAdvancesTotal.toLocaleString("en-IN")}
                </td>

                <td className="p-2.5 text-right font-mono font-black text-blue-900 whitespace-nowrap">
                  ₹{ledger.netPayable.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}

            {/* Total Row */}
            <tr className="bg-slate-100 border-t-2 border-slate-900 font-bold text-xs">
              <td colSpan={4} className="p-2.5 border-r border-slate-300 text-right uppercase tracking-wider text-[10px]">
                Consolidated Payroll Totals:
              </td>
              <td className="p-2.5 border-r border-slate-300 text-right font-mono font-bold whitespace-nowrap">
                ₹{totalWorkforceBase.toLocaleString("en-IN")}
              </td>
              <td className="p-2.5 border-r border-slate-300 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                +₹{totalWorkforceOt.toLocaleString("en-IN")}
              </td>
              <td className="p-2.5 border-r border-slate-300 text-right font-mono font-bold text-rose-700 whitespace-nowrap">
                -₹{totalWorkforceAdvances.toLocaleString("en-IN")}
              </td>
              <td className="p-2.5 text-right font-mono font-black text-sm text-blue-900 whitespace-nowrap">
                ₹{totalWorkforceNetPayable.toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ─────────────────────────────────────────────────────────
          4. TOTAL AMOUNT IN WORDS
      ───────────────────────────────────────────────────────── */}
      <div className="border-2 border-slate-900 rounded-2xl p-3.5 bg-slate-50 flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Total Net Payroll Liability
          </div>
          <div className="text-xl font-black font-mono text-blue-900 mt-0.5">
            ₹{totalWorkforceNetPayable.toLocaleString("en-IN")}
          </div>
          <div className="text-xs font-semibold text-slate-700 italic mt-0.5">
            <strong>In Words:</strong> {numberToIndianWords(totalWorkforceNetPayable)}
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-xs font-extrabold uppercase">
            Contractor Audit Verified
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          5. CONTRACTOR & AUDIT VERIFICATION SIGNATURES
      ───────────────────────────────────────────────────────── */}
      <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
        <div className="space-y-10">
          <div className="border-b border-slate-400 pb-1" />
          <div>
            <div className="font-extrabold text-slate-900">Accounts & Payroll Officer</div>
            <div className="text-[10px] text-slate-500">Prepared & Reconciled with Bank/Cash Records</div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="border-b border-slate-400 pb-1" />
          <div>
            <div className="font-extrabold text-slate-900">{company.contractorName}</div>
            <div className="text-[10px] text-slate-500">Authorized Signatory & Contractor Seal</div>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-200">
        Master Payroll Settlement Register • Generated under Contract Labour Regulation Act
      </div>
    </div>
  );
};
