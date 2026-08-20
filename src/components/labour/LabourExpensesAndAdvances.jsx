import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Receipt, Plus, Wallet, Camera, X } from "lucide-react";

export const LabourExpensesAndAdvances = () => {
  const { activeEmployee, expenses, projects, submitExpenseOrAdvance, showToast } = useApp();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const myExpenses = expenses.filter((e) => e.employeeId === activeEmployee?.id);
  const totalAdvances = myExpenses
    .filter((e) => e.type === "advance" && (e.status === "approved" || e.status === "disbursed"))
    .reduce((sum, e) => sum + e.amount, 0);

  const [form, setForm] = useState({
    amount: 500,
    purpose: "",
    description: "",
    projectId: activeEmployee?.assignedProjectId || projects[0]?.id || "",
    receiptPhoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80",
  });

  const handleSubmitVoucher = (e) => {
    e.preventDefault();
    submitExpenseOrAdvance({
      employeeId: activeEmployee.id,
      type: "expense",
      classification: "official",
      amount: parseFloat(form.amount) || 0,
      purpose: form.purpose,
      description: form.description,
      projectId: form.projectId,
      receiptPhoto: form.receiptPhoto,
    });
    setShowSubmitModal(false);
    showToast("✓ Expense voucher submitted! Awaiting Superadmin approval.", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              My Advances & Expense Vouchers
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            View cash advances received and submit site expense vouchers with receipt photos for reimbursement.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Expense Voucher</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Personal Advances Received</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">₹{totalAdvances}</div>
          <span className="text-[11px] text-slate-500">Deducted from monthly salary ledger</span>
        </div>
      </div>

      {/* Expense Vouchers List */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-100 text-base">Expense & Advance History</h3>

        {myExpenses.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center text-slate-500 text-xs">
            No expense or advance records found.
          </div>
        ) : (
          myExpenses.map((exp) => (
            <div key={exp.id} className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-100 text-sm">{exp.purpose}</h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {exp.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{exp.description}</p>
                <div className="text-[10px] text-slate-500 mt-1">Date: {exp.date}</div>
              </div>

              <div className="text-right">
                <div className="text-base font-mono font-extrabold text-amber-400">₹{exp.amount}</div>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                    exp.status === "approved"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {exp.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Voucher Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">Submit Expense Voucher</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitVoucher} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Expense Purpose / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PVC conduit pipe purchase"
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  className="w-full glass-input p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Expense Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full glass-input p-2.5 rounded-xl font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description / Details *</label>
                <textarea
                  required
                  rows="2"
                  placeholder="Explain why materials were purchased..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full glass-input p-2.5 rounded-xl"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  Submit Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
