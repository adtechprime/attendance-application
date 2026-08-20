import React from "react";
import { useApp } from "../../context/AppContext";
import { numberToIndianWords, formatIndianDate } from "../../utils/formatters";
import { Building2, IndianRupee, ShieldCheck, CheckCircle2 } from "lucide-react";

export const PayslipReceipt = ({ employee, ledger, dateStr = new Date().toISOString() }) => {
  const { company, projects } = useApp();

  const assignedSiteName =
    projects.find((p) => p.id === employee?.assignedProjectId)?.name ||
    (employee?.assignedProjectIds && projects.find((p) => employee.assignedProjectIds.includes(p.id))?.name) ||
    "Contractor Sites";

  const voucherNo = `PAY-${employee?.employeeCode}-${new Date(dateStr).getFullYear()}${String(new Date(dateStr).getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="space-y-6 text-slate-900 font-sans leading-relaxed">
      {/* ─────────────────────────────────────────────────────────
          1. CORPORATE LETTERHEAD
      ───────────────────────────────────────────────────────── */}
      <div className="border-b-2 border-slate-900 pb-4">
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
              <h1 className="text-2xl font-black tracking-tight text-blue-900">{company.name}</h1>
              <p className="text-xs font-bold text-slate-700">
                Government Licensed Civil & Infrastructure Contractors
              </p>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div><strong>Office:</strong> {company.address}</div>
                <div>
                  <strong>GSTIN:</strong> {company.gstNo} • <strong>Lic No:</strong> {company.licenceNo || company.contractorCode}
                </div>
                <div><strong>Helpline:</strong> {company.phone || company.contractorMobile} • <strong>Email:</strong> {company.email || company.contractorEmail}</div>
              </div>
            </div>
          </div>

          <div className="text-right border-2 border-slate-900 p-3 rounded-xl bg-slate-50 min-w-[200px]">
            <div className="text-[10px] font-black uppercase tracking-wider text-blue-900">
              Official Salary Slip
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">
              Voucher No: {voucherNo}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Date: <strong>{formatIndianDate(dateStr)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          2. WORKER PARTICULARS GRID
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-300 text-xs">
        <div>
          <span className="text-slate-500 font-medium">Employee Name:</span>
          <div className="font-extrabold text-sm text-slate-900">{employee?.name}</div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Employee Code:</span>
          <div className="font-mono font-bold text-blue-900">EMP-{employee?.employeeCode}</div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Designation / Trade:</span>
          <div className="font-bold text-slate-800">{employee?.designation}</div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Assigned Project Site:</span>
          <div className="font-bold text-slate-800">{assignedSiteName}</div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Government ID ({employee?.govtIdType || "Aadhaar"}):</span>
          <div className="font-mono font-bold text-slate-800">{employee?.govtIdNumber || "Verified"}</div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Registered Mobile:</span>
          <div className="font-mono font-bold text-slate-800">{employee?.mobile || "N/A"}</div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          3. ATTENDANCE & DUTY SUMMARY
      ───────────────────────────────────────────────────────── */}
      <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
        <div className="bg-slate-100 px-4 py-2 font-bold text-slate-800 border-b border-slate-300 uppercase tracking-wider text-[10px]">
          Duty & Attendance Summary
        </div>
        <div className="grid grid-cols-4 divide-x divide-slate-300 text-center p-3">
          <div>
            <div className="text-slate-500 text-[11px]">Daily Rate</div>
            <div className="font-mono font-bold text-slate-900 mt-1">₹{employee?.salary || 600}/day</div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Full Days Worked</div>
            <div className="font-mono font-bold text-slate-900 mt-1">{ledger?.presentDaysCount || 0} Days</div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Half Days Worked</div>
            <div className="font-mono font-bold text-slate-900 mt-1">{ledger?.halfDaysCount || 0} Days</div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Approved OT Shifts</div>
            <div className="font-mono font-bold text-emerald-700 mt-1">+{ledger?.approvedOtPeriods || 0} Shifts</div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          4. ITEMISED EARNINGS & DEDUCTIONS TABLE
      ───────────────────────────────────────────────────────── */}
      <div className="border border-slate-300 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
              <th className="p-3 border-r border-slate-300 w-1/2">Earnings Particulars</th>
              <th className="p-3 border-r border-slate-300 text-right w-1/4">Amount (₹)</th>
              <th className="p-3 border-r border-slate-300 w-1/2">Deductions Particulars</th>
              <th className="p-3 text-right w-1/4">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="p-3 border-r border-slate-300 font-medium">
                Basic Duty Wages ({ledger?.presentDaysCount || 0} Full + {ledger?.halfDaysCount || 0} Half)
              </td>
              <td className="p-3 border-r border-slate-300 font-mono font-bold text-right">
                ₹{(ledger?.baseEarnings || 0).toLocaleString("en-IN")}
              </td>
              <td className="p-3 border-r border-slate-300 font-medium text-rose-700">
                Private Cash Advances Debited
              </td>
              <td className="p-3 font-mono font-bold text-right text-rose-700">
                -₹{(ledger?.personalAdvancesTotal || 0).toLocaleString("en-IN")}
              </td>
            </tr>

            <tr>
              <td className="p-3 border-r border-slate-300 font-medium text-emerald-700">
                Overtime Bonus (+50% Daily rate / OT shift)
              </td>
              <td className="p-3 border-r border-slate-300 font-mono font-bold text-right text-emerald-700">
                +₹{(ledger?.otBonus || 0).toLocaleString("en-IN")}
              </td>
              <td className="p-3 border-r border-slate-300 font-medium text-slate-600">
                Direct Handover Payments
              </td>
              <td className="p-3 font-mono font-bold text-right text-slate-600">
                -₹{(ledger?.totalPaidOut || 0).toLocaleString("en-IN")}
              </td>
            </tr>

            <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
              <td className="p-3 border-r border-slate-300">Total Gross Earnings</td>
              <td className="p-3 border-r border-slate-300 font-mono text-right text-slate-900">
                ₹{((ledger?.baseEarnings || 0) + (ledger?.otBonus || 0)).toLocaleString("en-IN")}
              </td>
              <td className="p-3 border-r border-slate-300">Total Deductions</td>
              <td className="p-3 font-mono text-right text-rose-700">
                -₹{((ledger?.personalAdvancesTotal || 0) + (ledger?.totalPaidOut || 0)).toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ─────────────────────────────────────────────────────────
          5. NET PAYABLE BOX WITH AMOUNT IN WORDS
      ───────────────────────────────────────────────────────── */}
      <div className="border-2 border-slate-900 rounded-2xl p-4 bg-slate-50 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Net Wages Payable
          </div>
          <div className="text-xl font-black font-mono text-blue-900 mt-0.5">
            ₹{(ledger?.netPayable || 0).toLocaleString("en-IN")}
          </div>
          <div className="text-xs font-semibold text-slate-700 italic mt-1">
            <strong>In Words:</strong> {numberToIndianWords(ledger?.netPayable || 0)}
          </div>
        </div>

        <div className="text-right">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold uppercase">
            Payment Verified
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          6. LEGAL DISCLAIMER & DUAL SIGNATURE BOXES
      ───────────────────────────────────────────────────────── */}
      <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
        <div className="space-y-12">
          <div className="border-b border-slate-400 pb-1" />
          <div>
            <div className="font-extrabold text-slate-900">{employee?.name}</div>
            <div className="text-[10px] text-slate-500">Employee / Receiver Signature & Thumbprint</div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="border-b border-slate-400 pb-1" />
          <div>
            <div className="font-extrabold text-slate-900">{company.contractorName}</div>
            <div className="text-[10px] text-slate-500">Authorized Signatory & Official Contractor Seal</div>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-400 pt-3 border-t border-slate-200">
        This is a computer-generated workforce payslip voucher issued under the Contract Labour Regulation System.
      </div>
    </div>
  );
};
