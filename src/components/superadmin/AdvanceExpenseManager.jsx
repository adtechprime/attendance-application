import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Wallet,
  PlusCircle,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  IndianRupee,
  Receipt,
  FileText,
  LayoutGrid,
  List as ListIcon,
  Trash2,
  Calendar,
  Layers,
  X,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { ReceiptModal } from "../common/ReceiptModal";
import { PaymentVoucherReceipt } from "../receipts/PaymentVoucherReceipt";

export const AdvanceExpenseManager = () => {
  const { expenses, employees, projects, groups, company, addMoneyTransfer, deleteMoneyTransfer, showToast } = useApp();

  const [viewMode, setViewMode] = useState("list"); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // 'all' | 'official_expense' | 'private_advance'
  const [selectedSiteFilter, setSelectedSiteFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmTrx, setDeleteConfirmTrx] = useState(null);
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState(null);

  const initialFormState = {
    amount: "",
    purpose: "",
    senderName: company.contractorName,
    transferType: "official_expense", // 'official_expense' | 'private_advance'
    paymentMode: "Cash",
    projectId: projects[0]?.id || "",
    groupId: groups[0]?.id || "",
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // Filter groups for selected project in form
  const availableGroupsInForm = groups.filter(
    (g) => !formData.projectId || g.projectId === formData.projectId
  );

  const handleCreateTransfer = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }

    addMoneyTransfer({
      ...formData,
      amount: Number(formData.amount),
    });

    setIsModalOpen(false);
    setFormData(initialFormState);
    showToast("✓ Expense / Money Transfer entry recorded successfully!", "success");
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmTrx) {
      deleteMoneyTransfer(deleteConfirmTrx.id);
      showToast("✓ Record deleted successfully.", "success");
      setDeleteConfirmTrx(null);
    }
  };

  // Calculations
  const totalOfficialExpenses = expenses
    .filter((e) => e.transferType === "official_expense")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalPrivateAdvances = expenses
    .filter((e) => e.transferType === "private_advance")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  // Filter expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || e.transferType === typeFilter;
    const matchesSite = selectedSiteFilter === "all" || e.projectId === selectedSiteFilter;

    return matchesSearch && matchesType && matchesSite;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Top Header Card */}
      <div className="app-panel p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            Financial Ledger
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Money Transfers & Site Expenses
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track operational project expenses, assign to sites and squads, and manage private cash advances debited from worker salaries.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData(initialFormState);
            setIsModalOpen(true);
          }}
          className="px-5 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 btn-touch transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Money Transfer / Expense</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Official Site Cost */}
        <div className="app-card p-5 rounded-3xl space-y-2 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400">
            <span>Total Official Site Expenses</span>
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
            ₹{totalOfficialExpenses.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-500">
            Operational project materials, cement, diesel, tools, and squad logistics.
          </div>
        </div>

        {/* Total Private Advances */}
        <div className="app-card p-5 rounded-3xl space-y-2 border-l-4 border-l-rose-600">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
            <span>Total Private Labour Advances</span>
            <ArrowDownRight className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
            ₹{totalPrivateAdvances.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-500">
            Cash advances given to workers (automatically debited from monthly salary).
          </div>
        </div>
      </div>

      {/* Search, Filter & View Mode Switcher */}
      <div className="app-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by purpose, sender, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full app-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Site Filter */}
          <select
            value={selectedSiteFilter}
            onChange={(e) => setSelectedSiteFilter(e.target.value)}
            className="app-input px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <option value="all">All Sites</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>

          {/* Type Filter Buttons */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setTypeFilter("all")}
              className={`py-1.5 px-2.5 rounded-lg transition-all ${
                typeFilter === "all" ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter("official_expense")}
              className={`py-1.5 px-2.5 rounded-lg transition-all ${
                typeFilter === "official_expense" ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Site Cost
            </button>
            <button
              onClick={() => setTypeFilter("private_advance")}
              className={`py-1.5 px-2.5 rounded-lg transition-all ${
                typeFilter === "private_advance" ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Advance
            </button>
          </div>

          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
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
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          EMPTY STATE
      ───────────────────────────────────────────────────────── */}
      {filteredExpenses.length === 0 ? (
        <div className="app-card p-12 rounded-3xl text-center space-y-3">
          <Wallet className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {expenses.length === 0
              ? "Start by creating an expense or logging a cash advance for your workforce."
              : "No transactions match your search query or filters."}
          </p>
          <button
            onClick={() => {
              setFormData(initialFormState);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Record</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* ─────────────────────────────────────────────────────────
            1. GRID / CARD VIEW
        ───────────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.map((trx) => {
            const isPrivate = trx.transferType === "private_advance";
            const emp = employees.find((e) => e.id === trx.employeeId);
            const proj = projects.find((p) => p.id === trx.projectId);
            const grp = groups.find((g) => g.id === trx.groupId);

            return (
              <div
                key={trx.id}
                className="app-card p-5 rounded-3xl space-y-4 hover:border-blue-500 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top: Category Badge & Delete Button */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        isPrivate
                          ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                          : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      {isPrivate ? "Private Advance (Salary Debit)" : "Official Site Expense"}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedVoucherForPrint(trx)}
                        title="Print Official Voucher"
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1 text-[11px] font-bold px-2"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Voucher</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmTrx(trx)}
                        title="Delete Record"
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Amount & Purpose */}
                  <div>
                    <div
                      className={`text-2xl font-black font-mono ${
                        isPrivate ? "text-rose-600 dark:text-rose-400" : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      ₹{Number(trx.amount).toLocaleString("en-IN")}
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-1">{trx.purpose}</h4>
                  </div>

                  {/* Details List */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Sender / Payer:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{trx.senderName || company.contractorName}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Date:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{trx.date}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Project / Site:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                        {proj?.name || "General Site"}
                      </span>
                    </div>

                    {grp && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Squad / Group:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                          {grp.name}
                        </span>
                      </div>
                    )}

                    {emp && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Assigned Labour:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {emp.name} (EMP-{emp.employeeCode})
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Payment Mode:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{trx.paymentMode || "Cash"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span>Status: Completed</span>
                  <span className="font-mono">ID: {trx.id.slice(-6)}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────
            2. LIST / TABLE VIEW
        ───────────────────────────────────────────────────────── */
        <div className="app-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Category & Purpose</th>
                  <th className="p-4">Amount (₹)</th>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Project Site & Squad</th>
                  <th className="p-4">Labour Worker</th>
                  <th className="p-4">Mode & Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredExpenses.map((trx) => {
                  const isPrivate = trx.transferType === "private_advance";
                  const emp = employees.find((e) => e.id === trx.employeeId);
                  const proj = projects.find((p) => p.id === trx.projectId);
                  const grp = groups.find((g) => g.id === trx.groupId);

                  return (
                    <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      {/* Category & Purpose */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{trx.purpose}</div>
                        <span
                          className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isPrivate
                              ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                              : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          {isPrivate ? "Private Advance (Salary Debit)" : "Official Site Expense"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="p-4">
                        <div
                          className={`text-sm font-black font-mono ${
                            isPrivate ? "text-rose-600 dark:text-rose-400" : "text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          ₹{Number(trx.amount).toLocaleString("en-IN")}
                        </div>
                      </td>

                      {/* Sender */}
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                        {trx.senderName || company.contractorName}
                      </td>

                      {/* Site & Squad */}
                      <td className="p-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{proj?.name || "General"}</div>
                        {grp && <div className="text-[10px] text-slate-500">Squad: {grp.name}</div>}
                      </td>

                      {/* Labour Worker */}
                      <td className="p-4">
                        {emp ? (
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{emp.name}</div>
                            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
                              EMP-{emp.employeeCode}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Mode & Date */}
                      <td className="p-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{trx.paymentMode || "Cash"}</div>
                        <div className="text-[10px] font-mono text-slate-500">{trx.date}</div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedVoucherForPrint(trx)}
                            title="Print Official Voucher"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1 text-[11px] font-bold px-2"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Voucher</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmTrx(trx)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}

      {/* ─────────────────────────────────────────────────────────
          RECORD MONEY TRANSFER MODAL (FULL CONTROLS)
      ───────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="app-panel modal-dialog max-w-lg shadow-2xl animate-in fade-in">
            {/* Modal Header */}
            <div className="modal-header p-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  New Transaction
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  Log Money Transfer / Expense
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateTransfer} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="modal-body p-5 space-y-3.5 text-xs">
                {/* Category */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Transfer Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, transferType: "official_expense" })}
                      className={`py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                        formData.transferType === "official_expense"
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      Official Site Cost
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, transferType: "private_advance" })}
                      className={`py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                        formData.transferType === "private_advance"
                          ? "bg-rose-600 text-white border-rose-600 shadow-md"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      Private Cash Advance
                    </button>
                  </div>
                </div>

                {/* Amount & Sender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Amount (₹) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5000"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-black text-base text-slate-900 dark:text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Assign Sender Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-bold"
                    />
                  </div>
                </div>

                {/* Purpose / Item Description */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Purpose / Item Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cement Bags, Diesel Fuel, Scaffolding, or Worker Emergency Advance"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-medium"
                  />
                </div>

                {/* Put into Project / Site & Put into Site Group / Squad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Put into Site / Project <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-semibold cursor-pointer"
                    >
                      {projects.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {proj.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Put into Squad / Team Group
                    </label>
                    <select
                      value={formData.groupId}
                      onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-semibold cursor-pointer"
                    >
                      <option value="">General (No Squad)</option>
                      {availableGroupsInForm.map((grp) => (
                        <option key={grp.id} value={grp.id}>
                          {grp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Assign to Employee (Optional for site expense, required for private advance) */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assign to Labour Worker {formData.transferType === "private_advance" && <span className="text-rose-500">*</span>}
                  </label>
                  <select
                    required={formData.transferType === "private_advance"}
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-semibold cursor-pointer"
                  >
                    <option value="">{formData.transferType === "private_advance" ? "Select Worker to Debit Salary..." : "None (General Operational Cost)"}</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} (EMP-{emp.employeeCode} • {emp.designation})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Mode & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={formData.paymentMode}
                      onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-semibold cursor-pointer"
                    >
                      <option value="Cash">Cash in Hand</option>
                      <option value="UPI / GPay">UPI / GPay / PhonePe</option>
                      <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="modal-footer p-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2.5 bg-slate-50 dark:bg-slate-900/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 btn-touch cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md btn-touch cursor-pointer"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          DELETE CONFIRMATION MODAL
      ───────────────────────────────────────────────────────── */}
      {deleteConfirmTrx && (
        <div className="modal-overlay">
          <div className="app-panel rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in fade-in text-center my-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Delete Financial Record?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete this <strong>₹{Number(deleteConfirmTrx.amount).toLocaleString("en-IN")}</strong> ({deleteConfirmTrx.purpose}) entry?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTrx(null)}
                className="py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 btn-touch cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="py-2.5 rounded-xl font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-md btn-touch cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          PAYMENT VOUCHER RECEIPT PREVIEW MODAL
      ───────────────────────────────────────────────────────── */}
      {selectedVoucherForPrint && (
        <ReceiptModal
          isOpen={!!selectedVoucherForPrint}
          onClose={() => setSelectedVoucherForPrint(null)}
          title={`Payment Voucher - ${selectedVoucherForPrint.purpose}`}
          fileName={`Payment_Voucher_${selectedVoucherForPrint.id}_${selectedVoucherForPrint.purpose?.slice(0, 15)?.replace(/\s+/g, "_")}`}
        >
          <PaymentVoucherReceipt transaction={selectedVoucherForPrint} />
        </ReceiptModal>
      )}
    </div>
  );
};
