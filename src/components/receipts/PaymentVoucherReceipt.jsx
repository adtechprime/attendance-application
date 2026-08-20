import React from "react";
import { useApp } from "../../context/AppContext";
import { numberToIndianWords, formatIndianDate } from "../../utils/formatters";
import { CheckCircle2, ShieldCheck, Wallet, Receipt } from "lucide-react";

export const PaymentVoucherReceipt = ({ transaction }) => {
  const { company, employees, projects, groups } = useApp();

  const isPrivate = transaction.transferType === "private_advance";
  const emp = employees.find((e) => e.id === transaction.employeeId);
  const proj = projects.find((p) => p.id === transaction.projectId);
  const grp = groups.find((g) => g.id === transaction.groupId);

  const voucherNo = transaction.id ? `VCH-${transaction.id.replace("trx-", "").slice(-6)}` : "VCH-001";

  return (
    <div className="space-y-6 text-slate-900 font-sans leading-relaxed">
      {/* ─────────────────────────────────────────────────────────
          1. CORPORATE LETTERHEAD HEADER
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
              {isPrivate ? "Labour Cash Advance Voucher" : "Site Expense Payment Voucher"}
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">
              Voucher No: {voucherNo}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Date: <strong>{formatIndianDate(transaction.date)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          2. VOUCHER TRANSACTION PARTICULARS
      ───────────────────────────────────────────────────────── */}
      <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
        <div className="bg-slate-100 px-4 py-2 font-bold text-slate-800 border-b border-slate-300 uppercase tracking-wider text-[10px]">
          Payment Handover Details
        </div>
        <div className="grid grid-cols-2 gap-4 p-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <div className="space-y-2.5">
            <div>
              <span className="text-slate-500 font-medium">Disbursed / Paid By:</span>
              <div className="font-extrabold text-sm text-slate-900">
                {transaction.senderName || company.contractorName}
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-medium">Payment Mode:</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-blue-700" />
                <span>{transaction.paymentMode || "Cash in Hand"}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-medium">Chargeable Site / Project:</span>
              <div className="font-bold text-slate-800">{proj?.name || "General Operational"}</div>
              {proj?.locationName && <div className="text-[10px] text-slate-500">{proj.locationName}</div>}
            </div>
          </div>

          <div className="space-y-2.5 sm:pl-4 pt-3 sm:pt-0">
            <div>
              <span className="text-slate-500 font-medium">Paid To / Recipient Name:</span>
              <div className="font-extrabold text-sm text-slate-900">
                {emp ? `${emp.name} (EMP-${emp.employeeCode})` : transaction.purpose}
              </div>
              {emp && <div className="text-[11px] text-blue-700 font-semibold">{emp.designation}</div>}
            </div>

            {grp && (
              <div>
                <span className="text-slate-500 font-medium">Assigned Squad / Team:</span>
                <div className="font-bold text-slate-800">{grp.name}</div>
              </div>
            )}

            <div>
              <span className="text-slate-500 font-medium">Voucher Classification:</span>
              <div className="font-bold">
                {isPrivate ? (
                  <span className="text-rose-700">Private Cash Advance (Debited from monthly salary)</span>
                ) : (
                  <span className="text-blue-700">Official Project Material / Site Logistics Expense</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          3. PURPOSE & DESCRIPTION TABLE
      ───────────────────────────────────────────────────────── */}
      <div className="border border-slate-300 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
              <th className="p-3 border-r border-slate-300 w-12 text-center">Sr.</th>
              <th className="p-3 border-r border-slate-300">Description of Handover / Expense Item</th>
              <th className="p-3 border-r border-slate-300 w-36 text-center">Payment Category</th>
              <th className="p-3 text-right w-36">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-r border-slate-300 text-center font-mono font-bold">1</td>
              <td className="p-3 border-r border-slate-300">
                <div className="font-extrabold text-slate-900">{transaction.purpose}</div>
                {transaction.notes && (
                  <div className="text-[11px] text-slate-500 mt-1 italic leading-relaxed">
                    Notes: {transaction.notes}
                  </div>
                )}
              </td>
              <td className="p-3 border-r border-slate-300 text-center">
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                    isPrivate
                      ? "bg-rose-100 text-rose-800 border border-rose-300"
                      : "bg-blue-100 text-blue-800 border border-blue-300"
                  }`}
                >
                  {isPrivate ? "Advance" : "Site Expense"}
                </span>
              </td>
              <td className="p-3 font-mono font-black text-right text-base text-slate-900">
                ₹{Number(transaction.amount).toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ─────────────────────────────────────────────────────────
          4. TOTAL AMOUNT IN WORDS
      ───────────────────────────────────────────────────────── */}
      <div className="border-2 border-slate-900 rounded-2xl p-4 bg-slate-50 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Total Handover Amount
          </div>
          <div className="text-2xl font-black font-mono text-blue-900 mt-0.5">
            ₹{Number(transaction.amount).toLocaleString("en-IN")}
          </div>
          <div className="text-xs font-semibold text-slate-700 italic mt-1">
            <strong>In Words:</strong> {numberToIndianWords(transaction.amount)}
          </div>
        </div>

        <div className="text-right">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold uppercase">
            Disbursed & Logged
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          5. DUAL VERIFICATION & SIGNATURE BOXES
      ───────────────────────────────────────────────────────── */}
      <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
        <div className="space-y-12">
          <div className="border-b border-slate-400 pb-1" />
          <div>
            <div className="font-extrabold text-slate-900">{emp ? emp.name : "Payee Receiver"}</div>
            <div className="text-[10px] text-slate-500">Receiver's Signature / Thumb Impression</div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="border-b border-slate-400 pb-1" />
          <div>
            <div className="font-extrabold text-slate-900">{company.contractorName}</div>
            <div className="text-[10px] text-slate-500">Authorized Signatory & Contractor Stamp</div>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-400 pt-3 border-t border-slate-200">
        Official Contractor Financial Voucher • Generated via Apex Civil Management System
      </div>
    </div>
  );
};
