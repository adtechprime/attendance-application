import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Wallet,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  CreditCard,
  Building2,
  Calendar,
  IndianRupee,
  LayoutGrid,
  List as ListIcon,
  FileText,
  ArrowDownRight,
  ArrowUpRight,
  UserCheck,
  Check,
} from "lucide-react";
import { calculateEmployeeSalaryLedger } from "../../utils/calculations";
import { ReceiptModal } from "../common/ReceiptModal";
import { PayslipReceipt } from "../receipts/PayslipReceipt";
import { MasterPayrollReceipt } from "../receipts/MasterPayrollReceipt";

export const SalaryBook = ({ onSelectEmployeeProfile }) => {
  const { employees, attendance, expenses, payments, recordPayment, company, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'grid' | 'list'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedEmpForPayment, setSelectedEmpForPayment] = useState(null);
  
  // Document Receipt Modals
  const [showMasterPayrollModal, setShowMasterPayrollModal] = useState(false);
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState(null);

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    mode: "Cash",
    ref: "",
    notes: "",
  });

  const handleOpenPayment = (emp, netBalance) => {
    setSelectedEmpForPayment(emp);
    setPaymentForm({
      amount: netBalance > 0 ? netBalance : "",
      mode: "Cash",
      ref: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: "Salary Settlement",
    });
    setShowPaymentModal(true);
  };

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmpForPayment || Number(paymentForm.amount) <= 0) {
      showToast("Please enter a valid payment amount.", "error");
      return;
    }

    recordPayment({
      employeeId: selectedEmpForPayment.id,
      amount: Number(paymentForm.amount),
      mode: paymentForm.mode,
      ref: paymentForm.ref,
      notes: paymentForm.notes,
      date: new Date().toISOString().split("T")[0],
    });

    setShowPaymentModal(false);
    showToast(`✓ Payment of ₹${Number(paymentForm.amount).toLocaleString("en-IN")} recorded for ${selectedEmpForPayment.name}.`, "success");
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode?.includes(searchTerm) ||
      emp.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Overall Payroll Calculations
  let totalWorkforceBase = 0;
  let totalWorkforceOt = 0;
  let totalWorkforceAdvances = 0;
  let totalWorkforcePaid = 0;
  let totalWorkforceNetPayable = 0;

  employees.forEach((emp) => {
    const empAtt = attendance.filter((a) => a.employeeId === emp.id);
    const empExp = expenses.filter((e) => e.employeeId === emp.id);
    const empPay = payments.filter((p) => p.employeeId === emp.id);
    const ledger = calculateEmployeeSalaryLedger(emp, empAtt, empExp, empPay);

    totalWorkforceBase += ledger.baseEarnings;
    totalWorkforceOt += ledger.otBonus;
    totalWorkforceAdvances += ledger.personalAdvancesTotal;
    totalWorkforcePaid += ledger.totalPaidOut;
    totalWorkforceNetPayable += ledger.netPayable;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* ─────────────────────────────────────────────────────────
          HEADER PANEL (Hidden in Print)
      ───────────────────────────────────────────────────────── */}
      <div className="app-panel p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            Payroll Ledger & Settlements
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Master Salary Book
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated workforce wage calculations: daily rates, approved overtime bonuses, private cash advance deductions, and payout settlements.
          </p>
        </div>

        <button
          onClick={() => setShowMasterPayrollModal(true)}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 btn-touch transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Download Salary Sheet</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────
          SUMMARY METRICS
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {/* Gross Earned */}
        <div className="app-card p-4 rounded-2xl space-y-1 border-l-4 border-l-blue-600">
          <div className="text-[11px] font-bold text-slate-500">Gross Earned Wages</div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100">
            ₹{(totalWorkforceBase + totalWorkforceOt).toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-slate-400">Base Wages + OT Bonus</div>
        </div>

        {/* Total OT Bonus */}
        <div className="app-card p-4 rounded-2xl space-y-1 border-l-4 border-l-emerald-600">
          <div className="text-[11px] font-bold text-emerald-600">Approved OT Bonus</div>
          <div className="text-xl font-black text-emerald-600">
            +₹{totalWorkforceOt.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-slate-400">+50% Daily rate per OT shift</div>
        </div>

        {/* Private Advances Deducted */}
        <div className="app-card p-4 rounded-2xl space-y-1 border-l-4 border-l-rose-600">
          <div className="text-[11px] font-bold text-rose-600">Advances Deducted</div>
          <div className="text-xl font-black text-rose-600">
            -₹{totalWorkforceAdvances.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-slate-400">Private cash advances to labour</div>
        </div>

        {/* Net Outstanding Balance */}
        <div className="app-card p-4 rounded-2xl space-y-1 border-l-4 border-l-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20">
          <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400">Net Payable Balance</div>
          <div className="text-xl font-black text-indigo-700 dark:text-indigo-400">
            ₹{totalWorkforceNetPayable.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-slate-500">Pending worker payouts</div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          SEARCH & VIEW TOGGLE TOOLBAR
      ───────────────────────────────────────────────────────── */}
      <div className="app-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search worker by name, employee code, or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full app-input pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode("list")}
            title="List / Table View"
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            title="Grid / Card View"
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          PRINT-ONLY OFFICIAL HEADER
      ───────────────────────────────────────────────────────── */}
      <div className="hidden print-only mb-6 p-4 border-b-2 border-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">{company.name}</h1>
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
              Workforce Master Salary & Payroll Settlement Sheet
            </p>
          </div>
          <div className="text-right text-xs font-mono">
            <div><strong>Generated:</strong> {new Date().toLocaleDateString("en-IN")}</div>
            <div><strong>Contractor:</strong> {company.contractorName}</div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          WORKFORCE SALARY BREAKDOWN (TABLE & CARD VIEWS)
      ───────────────────────────────────────────────────────── */}
      {filteredEmployees.length === 0 ? (
        <div className="app-card p-12 text-center text-slate-400 text-xs rounded-3xl">
          No employees found matching the search criteria.
        </div>
      ) : viewMode === "list" ? (
        /* 1. LIST / TABLE VIEW */
        <div className="app-card rounded-3xl overflow-hidden printable-area">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Labour Worker</th>
                  <th className="p-4">Daily Rate</th>
                  <th className="p-4">Duty Days</th>
                  <th className="p-4">Earned Wages</th>
                  <th className="p-4 text-emerald-600">OT Bonus</th>
                  <th className="p-4 text-rose-600">Advances Deducted</th>
                  <th className="p-4 text-slate-700 dark:text-slate-300">Paid Out</th>
                  <th className="p-4 text-blue-600">Net Payable</th>
                  <th className="p-4 text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredEmployees.map((emp) => {
                  const empAttendance = attendance.filter((a) => a.employeeId === emp.id);
                  const empExpenses = expenses.filter((e) => e.employeeId === emp.id);
                  const empPayments = payments.filter((p) => p.employeeId === emp.id);

                  const ledger = calculateEmployeeSalaryLedger(emp, empAttendance, empExpenses, empPayments);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      {/* Labour Worker */}
                      <td className="p-4">
                        <div
                          onClick={() => {
                            if (onSelectEmployeeProfile) onSelectEmployeeProfile(emp.id);
                          }}
                          className="font-extrabold text-slate-900 dark:text-slate-100 hover:text-blue-600 cursor-pointer text-sm"
                        >
                          {emp.name}
                        </div>
                        <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                          EMP-{emp.employeeCode} • {emp.designation}
                        </div>
                      </td>

                      {/* Daily Rate */}
                      <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        ₹{Number(emp.salary || 600).toLocaleString("en-IN")}/day
                      </td>

                      {/* Days Worked */}
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                        {ledger.presentDaysCount} Present {ledger.halfDaysCount > 0 && `(${ledger.halfDaysCount} Half-day)`}
                      </td>

                      {/* Earned Wages */}
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                        ₹{ledger.baseEarnings.toLocaleString("en-IN")}
                      </td>

                      {/* OT Bonus */}
                      <td className="p-4 font-mono font-bold text-emerald-600">
                        +₹{ledger.otBonus.toLocaleString("en-IN")}
                      </td>

                      {/* Advance Deducted */}
                      <td className="p-4 font-mono font-bold text-rose-600">
                        -₹{ledger.personalAdvancesTotal.toLocaleString("en-IN")}
                      </td>

                      {/* Paid Out */}
                      <td className="p-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                        ₹{ledger.totalPaidOut.toLocaleString("en-IN")}
                      </td>

                      {/* Net Payable */}
                      <td className="p-4 font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                        ₹{ledger.netPayable.toLocaleString("en-IN")}
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right no-print">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPayslipEmp({ emp, ledger })}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px] btn-touch"
                          >
                            Payslip
                          </button>
                          <button
                            onClick={() => handleOpenPayment(emp, ledger.netPayable)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] shadow-sm btn-touch"
                          >
                            Pay Worker
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 2. GRID / CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => {
            const empAttendance = attendance.filter((a) => a.employeeId === emp.id);
            const empExpenses = expenses.filter((e) => e.employeeId === emp.id);
            const empPayments = payments.filter((p) => p.employeeId === emp.id);

            const ledger = calculateEmployeeSalaryLedger(emp, empAttendance, empExpenses, empPayments);

            return (
              <div
                key={emp.id}
                className="app-card p-5 rounded-3xl space-y-4 hover:border-blue-500 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{emp.name}</h4>
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        EMP-{emp.employeeCode} • {emp.designation}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400">
                      ₹{Number(emp.salary || 600)}/d
                    </span>
                  </div>

                  {/* Net Payable Highlight */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-900/80 border border-blue-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Net Payable Balance:</span>
                    <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">
                      ₹{ledger.netPayable.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Ledger Breakdown Grid */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Days Worked:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {ledger.presentDaysCount} Days {ledger.halfDaysCount > 0 && `+ ${ledger.halfDaysCount} Half`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Earned Regular Wages:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        ₹{ledger.baseEarnings.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-emerald-600">
                      <span>Approved Overtime Bonus:</span>
                      <span className="font-mono font-bold">+₹{ledger.otBonus.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex items-center justify-between text-rose-600">
                      <span>Private Advances Debited:</span>
                      <span className="font-mono font-bold">-₹{ledger.personalAdvancesTotal.toLocaleString("en-IN")}</span>
                    </div>

                    {ledger.totalPaidOut > 0 && (
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Direct Payments Disbursed:</span>
                        <span className="font-mono font-bold">-₹{ledger.totalPaidOut.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedPayslipEmp({ emp, ledger })}
                    className="py-2.5 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs btn-touch"
                  >
                    View Payslip
                  </button>
                  <button
                    onClick={() => handleOpenPayment(emp, ledger.netPayable)}
                    className="py-2.5 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-md btn-touch"
                  >
                    Pay Worker
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          RECORD SALARY PAYMENT MODAL
      ───────────────────────────────────────────────────────── */}
      {showPaymentModal && selectedEmpForPayment && (
        <div className="modal-overlay">
          <div className="app-panel modal-dialog max-w-sm shadow-2xl animate-in fade-in">
            {/* Modal Header */}
            <div className="modal-header p-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  Disburse Wages
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  Record Salary Handover
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleRecordPaymentSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="modal-body p-5 space-y-3.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {selectedEmpForPayment.name}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Code: <span className="font-mono font-bold text-blue-600">EMP-{selectedEmpForPayment.employeeCode}</span> • {selectedEmpForPayment.designation}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Amount (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-black text-lg text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentForm.mode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                    className="w-full app-input p-3 rounded-xl cursor-pointer font-semibold"
                  >
                    <option value="Cash">Cash in Hand</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Reference / Receipt No.
                  </label>
                  <input
                    type="text"
                    value={paymentForm.ref}
                    onChange={(e) => setPaymentForm({ ...paymentForm, ref: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="modal-footer p-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2.5 bg-slate-50 dark:bg-slate-900/60">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="py-3 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 btn-touch cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md btn-touch cursor-pointer"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          1. MASTER PAYROLL REGISTER RECEIPT MODAL
      ───────────────────────────────────────────────────────── */}
      {showMasterPayrollModal && (
        <ReceiptModal
          isOpen={showMasterPayrollModal}
          onClose={() => setShowMasterPayrollModal(false)}
          title="Master Workforce Payroll Settlement Register"
          fileName={`Master_Payroll_Register_${new Date().toISOString().split("T")[0]}`}
          orientation="landscape"
        >
          <MasterPayrollReceipt />
        </ReceiptModal>
      )}

      {/* ─────────────────────────────────────────────────────────
          2. INDIVIDUAL WORKER PAYSLIP RECEIPT MODAL
      ───────────────────────────────────────────────────────── */}
      {selectedPayslipEmp && (
        <ReceiptModal
          isOpen={!!selectedPayslipEmp}
          onClose={() => setSelectedPayslipEmp(null)}
          title={`Salary Slip Voucher - ${selectedPayslipEmp.emp.name} (EMP-${selectedPayslipEmp.emp.employeeCode})`}
          fileName={`Salary_Slip_EMP-${selectedPayslipEmp.emp.employeeCode}_${selectedPayslipEmp.emp.name?.replace(/\s+/g, "_")}`}
        >
          <PayslipReceipt employee={selectedPayslipEmp.emp} ledger={selectedPayslipEmp.ledger} />
        </ReceiptModal>
      )}
    </div>
  );
};
