import React from "react";
import { X, Printer, Building2, QrCode, Phone, HardHat, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const PrintableIDCard = ({ employee, onClose }) => {
  const { company, projects } = useApp();

  if (!employee) return null;

  const assignedProject = projects.find((p) => p.id === employee.assignedProjectId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
        {/* Modal Controls */}
        <div className="flex items-center justify-between no-print border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-sm">Official Employee ID Card</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Badge</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable ID Card Container */}
        <div className="printable-area flex justify-center">
          <div className="w-[320px] bg-slate-950 border-2 border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl relative text-slate-100">
            {/* Header Ribbon */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-4 text-slate-950 text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Building2 className="w-5 h-5 font-bold stroke-[2.5]" />
                <span className="font-black text-sm uppercase tracking-wider">{company.name}</span>
              </div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900/80">
                Official Labour Identity Card
              </p>
            </div>

            {/* Profile Avatar & Badges */}
            <div className="p-5 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-500/40 shadow-xl"
                />
                <span className="absolute -bottom-2 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  ACTIVE LABOUR
                </span>
              </div>

              {/* Name & Role */}
              <h2 className="font-extrabold text-lg text-slate-100 tracking-tight mt-1">{employee.name}</h2>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">{employee.designation}</p>

              {/* Codes Grid */}
              <div className="grid grid-cols-2 gap-2 w-full mt-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase">Emp Code</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">{employee.employeeCode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase">Company Code</span>
                  <span className="font-mono font-bold text-slate-200 text-xs">{employee.companyCode}</span>
                </div>
              </div>

              {/* Minimal Info */}
              <div className="w-full text-left space-y-2 mt-3.5 text-xs text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400 font-medium">Assigned Site:</span>
                  <span className="font-bold text-slate-200 truncate max-w-[170px]" title={assignedProject?.name}>
                    {assignedProject?.name || "General Site"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400 font-medium">Mobile:</span>
                  <span className="font-mono font-semibold text-slate-200">{employee.mobile}</span>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-slate-400 font-medium">Emergency:</span>
                  <span className="font-mono font-semibold text-rose-300">{employee.emergencyContact}</span>
                </div>
              </div>

              {/* QR Code Scan Zone */}
              <div className="mt-4 pt-3 border-t border-slate-800 w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-10 h-10 text-amber-400 p-1 bg-slate-900 rounded-lg border border-slate-800" />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-slate-300">Scan for Verification</div>
                    <div className="text-[9px] text-slate-500 font-mono">ID: {employee.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-slate-400">ISSUED BY</div>
                  <div className="text-[10px] font-extrabold text-amber-400">JAVED CONTRACTOR</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-900 p-2 text-center text-[9px] text-slate-500 border-t border-slate-800 uppercase tracking-widest">
              Property of AdTech Prime Infrastructure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
