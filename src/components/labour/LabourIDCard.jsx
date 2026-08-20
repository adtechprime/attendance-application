import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatIndianDate } from "../../utils/formatters";
import {
  Building2,
  Phone,
  ShieldCheck,
  QrCode,
  Printer,
  Calendar,
  CreditCard,
  Shield,
} from "lucide-react";
import { ReceiptModal } from "../common/ReceiptModal";
import { LabourIDCardReceipt } from "../receipts/LabourIDCardReceipt";

export const LabourIDCard = () => {
  const { activeEmployee, company, projects, groups } = useApp();
  const [showPrintModal, setShowPrintModal] = useState(false);

  const assignedProject = projects.find((p) => p.id === activeEmployee?.assignedProjectId) || projects[0];
  const assignedGroup = groups.find((g) => g.id === activeEmployee?.assignedGroupId) || groups[0];

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  if (!activeEmployee) {
    return (
      <div className="max-w-md mx-auto p-6 text-center text-slate-400 text-xs font-sans">
        No employee selected.
      </div>
    );
  }

  const validityFormatted = activeEmployee.cardValidity
    ? formatIndianDate(activeEmployee.cardValidity)
    : "31/12/2027";

  return (
    <div className="max-w-md mx-auto space-y-4 pb-6 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between no-print">
        <div>
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            Identity Credential
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Employee ID Card</h2>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md btn-touch cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Badge</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────
          ON-SCREEN DIGITAL ID BADGE (WHITE & BLUE)
      ───────────────────────────────────────────────────────── */}
      <div className="app-card rounded-3xl overflow-hidden border-2 border-blue-600 dark:border-blue-500 shadow-xl bg-white dark:bg-slate-900">
        {/* Card Header: Logo on Left, Company Name & Licence on Right */}
        <div className="bg-blue-600 dark:bg-blue-700 text-white p-4 flex items-center justify-center gap-3 text-left">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-10 h-10 rounded-xl object-contain bg-white p-1 shrink-0 border border-blue-400 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white shrink-0 border border-white/20">
              <Building2 className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-black tracking-tight leading-tight truncate">{company.name}</h3>
            <div className="text-[10.5px] font-mono text-blue-100 font-semibold truncate pt-0.5">
              Lic: {company.licenceNo || company.contractorCode || "LIC-CIVIL-MH-2026"}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4 text-center">
          {/* Avatar Photo with Status Badge */}
          <div className="relative inline-block mx-auto">
            <img
              src={activeEmployee.avatar}
              alt={activeEmployee.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-lg mx-auto"
            />
            <span
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md text-white ${
                activeEmployee.status === "inactive" ? "bg-rose-600" : "bg-emerald-600"
              }`}
            >
              {activeEmployee.status === "inactive" ? "Inactive" : "Active"}
            </span>
          </div>

          <div>
            <h4 className="text-xl font-black text-slate-900 dark:text-slate-100">{activeEmployee.name}</h4>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              {activeEmployee.designation}
            </div>
            <div className="inline-block mt-2 font-mono font-black text-sm bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-3.5 py-1 rounded-full border border-blue-200 dark:border-slate-700">
              EMP-{activeEmployee.employeeCode}
            </div>
          </div>

          {/* Details Table (All Mandatory First-Page Information) */}
          <div className="grid grid-cols-2 gap-2 text-left text-xs pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block font-semibold">Assigned Site</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] truncate block">
                {assignedProject?.name || "All Sites"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block font-semibold">Mobile Number</span>
              <span className="font-bold font-mono text-slate-900 dark:text-slate-100 text-[11px]">
                {activeEmployee.mobile || "+91 98765 00000"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block font-semibold">Government ID</span>
              <span className="font-bold font-mono text-slate-900 dark:text-slate-100 text-[11px] truncate block">
                {activeEmployee.govtIdType || "Aadhaar"}: {activeEmployee.govtIdNumber || "Verified"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block font-semibold">Emergency Contact</span>
              <span className="font-bold font-mono text-rose-600 dark:text-rose-400 text-[11px] truncate block">
                {activeEmployee.emergencyContact || activeEmployee.alternateMobile || activeEmployee.mobile || "N/A"}
              </span>
            </div>

            <div className="col-span-2 p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-700 dark:text-blue-300 block font-bold">
                  Card Validity / Expiry
                </span>
                <span className="font-mono font-black text-blue-900 dark:text-blue-200 text-xs">
                  {validityFormatted}
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase">
                Superadmin Managed
              </span>
            </div>
          </div>

          {/* QR Code Zone */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Official Scan Code
              </div>
              <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                SITE-INFRA-{activeEmployee.employeeCode}
              </div>
              <div className="text-[10px] text-slate-400">Valid on all authorized sites</div>
            </div>

            <div className="w-14 h-14 bg-white p-1.5 rounded-xl border border-slate-300 flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <span>Authorized: {company.contractorName}</span>
            <span>Helpline: {company.phone}</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          PRINTABLE BADGE RECEIPT MODAL (CR80 DUAL SIDE)
      ───────────────────────────────────────────────────────── */}
      {showPrintModal && (
        <ReceiptModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          title={`Contractor ID Badge - ${activeEmployee.name} (EMP-${activeEmployee.employeeCode})`}
          fileName={`Labour_ID_Card_EMP-${activeEmployee.employeeCode}_${activeEmployee.name?.replace(/\s+/g, "_")}`}
        >
          <LabourIDCardReceipt employee={activeEmployee} />
        </ReceiptModal>
      )}
    </div>
  );
};
