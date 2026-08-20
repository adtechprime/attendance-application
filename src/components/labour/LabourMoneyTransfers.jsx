import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Calendar,
  Building2,
} from "lucide-react";
import { ReceiptModal } from "../common/ReceiptModal";
import { PaymentVoucherReceipt } from "../receipts/PaymentVoucherReceipt";

export const LabourMoneyTransfers = () => {
  const { activeEmployee, expenses, projects } = useApp();

  const [selectedVoucherForReceipt, setSelectedVoucherForReceipt] = useState(null);

  // Filter transfers related to this employee
  const empTransfers = expenses.filter((e) => e.employeeId === activeEmployee?.id);

  // Private Advances (debited from salary)
  const totalPrivateAdvances = empTransfers
    .filter((e) => e.transferType === "private_advance")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  // Official Expenses (reimbursed by contractor)
  const totalOfficialExpenses = empTransfers
    .filter((e) => e.transferType === "official_expense")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="max-w-md mx-auto space-y-4 pb-6 font-sans">
      {/* Overview Balance Cards */}
      <div className="app-panel p-5 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Money Ledger
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Transfers & Advances</h2>
          </div>
        </div>

        {/* Breakdown Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Private Advance (Debited from salary) */}
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
              <span>Cash Advance</span>
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-black text-rose-800 dark:text-rose-200 font-mono">
              ₹{totalPrivateAdvances.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">
              ● Deducted in Payslip
            </div>
          </div>

          {/* Official Site Expense (Reimbursed) */}
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400">
              <span>Official Cost</span>
              <ArrowUpRight className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-black text-blue-800 dark:text-blue-200 font-mono">
              ₹{totalOfficialExpenses.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              ● Contractor Reimbursed
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History List */}
      <div className="app-card p-4 rounded-3xl space-y-3">
        <h3 className="text-xs font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Issued Financial Records ({empTransfers.length})
        </h3>

        {empTransfers.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No cash advances or expenses logged yet.
          </div>
        ) : (
          <div className="space-y-2">
            {empTransfers.map((trx) => {
              const isPrivate = trx.transferType === "private_advance";
              const proj = projects.find((p) => p.id === trx.projectId);

              return (
                <div
                  key={trx.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {trx.purpose || (isPrivate ? "Cash Advance" : "Site Expense")}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {trx.date}
                      </span>
                      <span>•</span>
                      <span className="truncate">{proj?.name || "Main Site"}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Payment Mode: <strong>{trx.paymentMode || "Cash"}</strong>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div>
                      <div
                        className={`text-sm font-black font-mono ${
                          isPrivate ? "text-rose-600 dark:text-rose-400" : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {isPrivate ? "-" : "+"}₹{Number(trx.amount).toLocaleString("en-IN")}
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block">
                        ✓ Disbursed
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedVoucherForReceipt(trx)}
                      title="View Official Voucher"
                      className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 transition-all btn-touch cursor-pointer"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────
          PAYMENT VOUCHER RECEIPT PREVIEW MODAL
      ───────────────────────────────────────────────────────── */}
      {selectedVoucherForReceipt && (
        <ReceiptModal
          isOpen={!!selectedVoucherForReceipt}
          onClose={() => setSelectedVoucherForReceipt(null)}
          title={`Official Payment Voucher - ${selectedVoucherForReceipt.purpose || "Advance Disbursement"}`}
          fileName={`Payment_Voucher_${selectedVoucherForReceipt.id}_${selectedVoucherForReceipt.purpose?.slice(0, 15)?.replace(/\s+/g, "_")}`}
        >
          <PaymentVoucherReceipt transaction={selectedVoucherForReceipt} />
        </ReceiptModal>
      )}
    </div>
  );
};
