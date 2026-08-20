import React from "react";
import { useApp } from "../../context/AppContext";
import { formatIndianDate } from "../../utils/formatters";
import { MapPin, Camera, CheckCircle2 } from "lucide-react";

export const AttendanceRosterReceipt = ({ date, records }) => {
  const { company, employees, projects } = useApp();

  const totalPresent = records.filter((r) => r.status === "present" || r.status === "late").length;
  const totalLate = records.filter((r) => r.status === "late").length;
  const totalOt = records.filter((r) => r.overtimeStatus === "approved").length;

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
              Daily Attendance Roster
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">
              Date: {formatIndianDate(date)}
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
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Punches Logged</span>
          <div className="text-base font-black text-slate-900 mt-0.5">{records.length}</div>
        </div>
        <div className="px-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Present On Duty</span>
          <div className="text-base font-black text-emerald-700 mt-0.5">{totalPresent}</div>
        </div>
        <div className="px-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Late Arrivals</span>
          <div className="text-base font-black text-amber-700 mt-0.5">{totalLate}</div>
        </div>
        <div className="px-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Approved Overtime</span>
          <div className="text-base font-black text-blue-700 mt-0.5">{totalOt}</div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          3. ATTENDANCE AUDIT TABLE (FIXED COLUMNS & BORDERS)
      ───────────────────────────────────────────────────────── */}
      <div className="border border-slate-300 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[9.5px]">
              <th className="p-2.5 border-r border-slate-300 w-10 text-center">Sr.</th>
              <th className="p-2.5 border-r border-slate-300 w-44">Labour Worker & Trade</th>
              <th className="p-2.5 border-r border-slate-300 w-24 text-center">Live Selfies</th>
              <th className="p-2.5 border-r border-slate-300 w-36">Site & In Details</th>
              <th className="p-2.5 border-r border-slate-300 w-36">Out Details</th>
              <th className="p-2.5 text-center w-28">Duty Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {records.map((att, idx) => {
              const emp = employees.find((e) => e.id === att.employeeId);
              const proj = projects.find((p) => p.id === att.projectId);
              const isLate = att.status === "late";
              const isOt = att.overtimeStatus === "approved";

              const inGpsStr =
                att.punchInLat && att.punchInLng
                  ? `${Number(att.punchInLat).toFixed(4)}, ${Number(att.punchInLng).toFixed(4)}`
                  : "GPS Match";

              const outGpsStr =
                att.punchOutLat && att.punchOutLng
                  ? `${Number(att.punchOutLat).toFixed(4)}, ${Number(att.punchOutLng).toFixed(4)}`
                  : null;

              return (
                <tr key={att.id} className="hover:bg-slate-50">
                  <td className="p-2.5 border-r border-slate-300 text-center font-mono font-bold text-slate-500">
                    {idx + 1}
                  </td>

                  {/* Labour Worker */}
                  <td className="p-2.5 border-r border-slate-300 truncate">
                    <div className="font-extrabold text-slate-900 truncate">{emp?.name || "Labour"}</div>
                    <div className="text-[10px] font-mono text-blue-900 font-bold truncate">
                      EMP-{emp?.employeeCode} • {emp?.designation}
                    </div>
                  </td>

                  {/* Selfies */}
                  <td className="p-2.5 border-r border-slate-300 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {att.punchInSelfie ? (
                        <img
                          src={att.punchInSelfie}
                          alt="In"
                          crossOrigin="anonymous"
                          className="w-8 h-8 rounded-lg object-cover border border-emerald-600 shadow-sm bg-slate-100"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-[9px] text-slate-400">No In</span>
                      )}
                      {att.punchOutSelfie && (
                        <img
                          src={att.punchOutSelfie}
                          alt="Out"
                          crossOrigin="anonymous"
                          className="w-8 h-8 rounded-lg object-cover border border-rose-600 shadow-sm bg-slate-100"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                  </td>

                  {/* In Details & GPS */}
                  <td className="p-2.5 border-r border-slate-300 text-[11px] truncate">
                    <div className="font-bold text-slate-800 truncate">{att.siteName || proj?.name}</div>
                    <div className="font-mono text-emerald-700 font-bold whitespace-nowrap">
                      In: {att.punchInTime || "Logged"}
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 truncate">
                      GPS: {inGpsStr}
                    </div>
                  </td>

                  {/* Out Details & GPS */}
                  <td className="p-2.5 border-r border-slate-300 text-[11px] truncate">
                    <div className="font-mono text-blue-700 font-bold whitespace-nowrap">
                      Out: {att.punchOutTime || "On Duty"}
                    </div>
                    {outGpsStr && (
                      <div className="text-[9px] font-mono text-slate-500 truncate">
                        GPS: {outGpsStr}
                      </div>
                    )}
                  </td>

                  {/* Duty Status */}
                  <td className="p-2.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        isLate
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}
                    >
                      {isLate ? "Late Arrival" : "On Time"}
                    </span>
                    {isOt && (
                      <span className="block mt-0.5 text-[9px] font-bold text-blue-800">
                        +OT Approved
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─────────────────────────────────────────────────────────
          4. SUPERVISOR & CONTRACTOR VERIFICATION SIGNATURES
      ───────────────────────────────────────────────────────── */}
      <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
        <div className="space-y-10">
          <div className="border-b border-slate-400 pb-1" />
          <div>
            <div className="font-extrabold text-slate-900">Site In-Charge / Project Engineer</div>
            <div className="text-[10px] text-slate-500">Physical Verification & Attendance Cross-check</div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="border-b border-slate-400 pb-1" />
          <div>
            <div className="font-extrabold text-slate-900">{company.contractorName}</div>
            <div className="text-[10px] text-slate-500">Authorized Signatory & Official Contractor Seal</div>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-200">
        Official Workforce Geo-Attendance Audit Register • Apex Civil Construction Management
      </div>
    </div>
  );
};
