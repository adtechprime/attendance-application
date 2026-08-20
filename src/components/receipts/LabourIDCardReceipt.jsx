import React from "react";
import { useApp } from "../../context/AppContext";
import { formatIndianDate } from "../../utils/formatters";
import { Building2, ShieldCheck, QrCode, Phone, MapPin, UserCheck, Shield } from "lucide-react";

export const LabourIDCardReceipt = ({ employee }) => {
  const { company, projects } = useApp();

  const assignedSiteName =
    projects.find((p) => p.id === employee?.assignedProjectId)?.name ||
    (employee?.assignedProjectIds && projects.find((p) => employee.assignedProjectIds.includes(p.id))?.name) ||
    "All Contractor Sites";

  const validityFormatted = employee?.cardValidity
    ? formatIndianDate(employee.cardValidity)
    : "31/12/2027";

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Document Letterhead (for A4 Print & Archive) */}
      <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-300 p-1 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-black text-blue-900 leading-tight">{company.name}</h2>
            <p className="text-xs font-mono font-bold text-slate-600">
              Lic: {company.licenceNo || company.contractorCode || "LIC-CIVIL-MH-2026"} {company.gstNo ? `• GST: ${company.gstNo}` : ""}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-extrabold uppercase bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-lg">
            Standard CR80 Badge (Front & Back)
          </span>
        </div>
      </div>

      {/* Dual Badge Container (Front & Back) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
        {/* ─────────────────────────────────────────────────────────
            PAGE 1 / FRONT SIDE OF ID CARD (WHITE & BLUE)
            Mandatory: Photo, Status, Designation, EMP Code, Site, 
            Mobile, Govt. ID, Emergency Contact, Card Validity
        ───────────────────────────────────────────────────────── */}
        <div className="w-[310px] min-h-[505px] rounded-2xl bg-white text-slate-900 flex flex-col justify-between shadow-xl relative overflow-hidden border-2 border-blue-900">
          {/* Top Blue Header: Logo on Left, Company Name & Licence on Right */}
          <div className="bg-blue-900 text-white p-3 flex items-center gap-2.5 text-left shrink-0">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-blue-800 flex items-center justify-center font-bold text-white shrink-0 border border-blue-700">
                <Building2 className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-black text-xs tracking-tight leading-tight truncate">{company.name}</h3>
              <p className="text-[8.5px] font-mono font-semibold tracking-wide text-blue-200 truncate pt-0.5">
                Lic: {company.licenceNo || company.contractorCode || "LIC-CIVIL-MH-2026"}
              </p>
            </div>
          </div>

          {/* Photo, Name & Designation */}
          <div className="text-center px-4 pt-3 pb-1 space-y-1.5">
            <div className="relative inline-block mx-auto">
              <img
                src={employee?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"}
                alt={employee?.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto border-3 border-blue-900 shadow-md bg-slate-100"
              />
              <span
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full shadow-md text-white ${
                  employee?.status === "inactive" ? "bg-rose-600" : "bg-emerald-600"
                }`}
              >
                {employee?.status === "inactive" ? "Inactive" : "Active"}
              </span>
            </div>

            <div className="pt-1">
              <h4 className="font-black text-sm tracking-tight text-slate-900 leading-tight truncate">{employee?.name}</h4>
              <p className="text-[10.5px] font-extrabold text-blue-800 uppercase tracking-wider">
                {employee?.designation}
              </p>
            </div>

            {/* EMP Code Box */}
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-3 py-0.5">
              <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Employee Code
              </span>
              <span className="font-mono text-sm font-black text-blue-900 tracking-wider">
                EMP-{employee?.employeeCode}
              </span>
            </div>
          </div>

          {/* Structured Details Matrix (All Mandatory Information) */}
          <div className="mx-3 mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-[10px] space-y-1.5 leading-tight">
            <div className="flex justify-between items-center border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-semibold">Assigned Site:</span>
              <span className="font-bold text-slate-900 truncate max-w-[165px]">{assignedSiteName}</span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-semibold">Mobile No:</span>
              <span className="font-mono font-bold text-slate-900">{employee?.mobile || "N/A"}</span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-semibold">Govt. ID:</span>
              <span className="font-mono font-bold text-slate-900 truncate max-w-[170px]">
                {employee?.govtIdType || "Aadhaar"}: {employee?.govtIdNumber || "Verified"}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-semibold">Emergency Contact:</span>
              <span className="font-mono font-bold text-rose-700">
                {employee?.emergencyContact || employee?.alternateMobile || employee?.mobile || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center pt-0.5">
              <span className="text-slate-500 font-semibold">Card Validity:</span>
              <span className="font-mono font-black text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-200">
                {validityFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            PAGE 2 / BACK SIDE OF ID CARD (WHITE & BLUE)
            Site Regulations, Terms, QR Verification & Signatory Seal
        ───────────────────────────────────────────────────────── */}
        <div className="w-[310px] min-h-[505px] rounded-2xl bg-white text-slate-900 flex flex-col justify-between shadow-xl relative overflow-hidden border-2 border-slate-800">
          {/* Header */}
          <div className="bg-slate-900 text-white p-3 text-center shrink-0">
            <div className="text-[9px] font-black uppercase tracking-wider text-slate-300">
              Workforce Security & Site Regulations
            </div>
            <div className="text-[10px] font-bold text-slate-100 mt-0.5">
              Lic: {company.licenceNo || company.contractorCode} {company.gstNo ? `• GST: ${company.gstNo}` : ""}
            </div>
          </div>

          {/* QR Code & Digital Verification */}
          <div className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-300">
              <div className="w-14 h-14 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 border border-slate-300">
                <QrCode className="w-10 h-10 text-slate-900" />
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="font-bold text-slate-900 uppercase">
                  Digital Verification
                </div>
                <div className="text-[9px] text-slate-500 leading-tight">
                  Scan QR code for instant workforce status & geo-punch authorization.
                </div>
              </div>
            </div>

            {/* Terms & Site Regulations */}
            <div className="space-y-1.5 text-[9.5px] text-slate-600 leading-relaxed p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-800 uppercase text-[9px]">Terms & Conditions:</p>
              <p>• This identity card is property of {company.name} and non-transferable.</p>
              <p>• Must be carried while on site and produced upon security inspection.</p>
              <p>• Daily wage attendance is verified through GPS selfie punch-in.</p>
              <p>• Card validity renewal is controlled exclusively by Superadmin.</p>
              <p>• If lost/found, return to: {company.address || "Contractor Site Office"}.</p>
            </div>
          </div>

          {/* Signatory Seal */}
          <div className="text-center p-3 border-t border-slate-200 bg-slate-50 space-y-0.5 shrink-0">
            <div className="font-black text-xs text-slate-900">{company.contractorName || "Authorized Signatory"}</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">
              Authorized Signatory & Contractor Stamp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
