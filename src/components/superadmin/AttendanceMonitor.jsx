import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Clock,
  Calendar as CalendarIcon,
  MapPin,
  Camera,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Zap,
  X,
  ExternalLink,
  Navigation,
  FileSpreadsheet,
  Layers,
  LayoutGrid,
  List as ListIcon,
  UserCheck,
} from "lucide-react";
import { ReceiptModal } from "../common/ReceiptModal";
import { AttendanceRosterReceipt } from "../receipts/AttendanceRosterReceipt";

export const AttendanceMonitor = () => {
  const { attendance, employees, projects, company } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // 'cards' | 'list'
  const [previewSelfieUrl, setPreviewSelfieUrl] = useState(null);
  const [gpsModalRecord, setGpsModalRecord] = useState(null);
  const [showRosterReceiptModal, setShowRosterReceiptModal] = useState(false);

  const filteredAttendance = attendance.filter((att) => {
    const matchesDate = !selectedDate || att.date === selectedDate;
    const matchesEmp =
      selectedEmployeeFilter === "all" || att.employeeId === selectedEmployeeFilter;
    return matchesDate && matchesEmp;
  });

  const handlePrintRoster = () => {
    setShowRosterReceiptModal(true);
  };

  // Helper to generate Google Maps embed URL
  const getMapEmbedUrl = (lat, lng) => {
    if (!lat || !lng) return null;
    return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  };

  // Helper to generate Google Maps external link
  const getGoogleMapsLink = (lat, lng) => {
    if (!lat || !lng) return "#";
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* ─────────────────────────────────────────────────────────
          SCREEN HEADER (Hidden in Print)
      ───────────────────────────────────────────────────────── */}
      <div className="app-panel p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            Site Punch Roster
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Live Attendance Monitor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time site punch-in/out tracking with selfie snapshots, dual GPS pinpoint maps, and printable PDF reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrintRoster}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 btn-touch transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Download PDF Roster</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          FILTER CONTROLS (Hidden in Print)
      ───────────────────────────────────────────────────────── */}
      <div className="app-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 no-print">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
            Filter by Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full app-input p-2.5 rounded-xl text-xs font-bold font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
            Filter by Labour Worker
          </label>
          <select
            value={selectedEmployeeFilter}
            onChange={(e) => setSelectedEmployeeFilter(e.target.value)}
            className="w-full app-input p-2.5 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <option value="all">All Workers ({employees.length})</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} (EMP-{emp.employeeCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          PRINT-ONLY OFFICIAL HEADER (Appears on Printed PDF)
      ───────────────────────────────────────────────────────── */}
      <div className="hidden print-only mb-6 p-4 border-b-2 border-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">{company.name}</h1>
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
              Daily Workforce Attendance & Geo-Verification Roster
            </p>
          </div>
          <div className="text-right text-xs font-mono">
            <div><strong>Date:</strong> {selectedDate || "All Dates"}</div>
            <div><strong>Printed On:</strong> {new Date().toLocaleString("en-IN")}</div>
            <div><strong>Contractor:</strong> {company.contractorName}</div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          ATTENDANCE ROSTER TABLE (Interactive on screen, printable in PDF)
      ───────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────
          ATTENDANCE ROSTER (Card View on Mobile, Table on Desktop with Toggle)
      ───────────────────────────────────────────────────────── */}
      <div className="app-card rounded-3xl overflow-hidden printable-area">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Punches for {selectedDate || "All Dates"} ({filteredAttendance.length})
            </h3>
            <p className="text-xs text-slate-500">
              Includes live selfie photos, In/Out times, and dual GPS map coordinates.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("cards")}
              title="Card View (Mobile Optimized)"
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              title="Table View (Full Screen Sheet)"
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filteredAttendance.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No attendance punches logged for the selected date.
          </div>
        ) : viewMode === "cards" ? (
          /* ─────────────────────────────────────────────────────────
              1. MOBILE-FRIENDLY CARDS VIEW
          ───────────────────────────────────────────────────────── */
          <div className="p-3 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredAttendance.map((att) => {
              const emp = employees.find((e) => e.id === att.employeeId);
              const proj = projects.find((p) => p.id === att.projectId);
              const isLate = att.status === "late";
              const isOtApproved = att.overtimeStatus === "approved";

              return (
                <div
                  key={att.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs hover:border-blue-500 transition-all flex flex-col justify-between"
                >
                  {/* Top: Worker Photo, Name, Code & Status */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={att.punchInSelfie || emp?.avatar}
                        alt={emp?.name}
                        onClick={() => att.punchInSelfie && setPreviewSelfieUrl(att.punchInSelfie)}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-600 shadow-sm shrink-0 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {emp?.name || "Labour Worker"}
                        </h4>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                          {emp?.designation}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          EMP-{emp?.employeeCode}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isLate
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300"
                            : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300"
                        }`}
                      >
                        {isLate ? "Late" : "On Time"}
                      </span>

                      {isOtApproved && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-600 text-white">
                          +OT Approved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Punch In & Punch Out Times Grid */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">1. Punch IN</span>
                      <strong className="text-emerald-600 font-bold font-mono text-xs">
                        {att.punchInTime || "—"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">2. Punch OUT</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-bold font-mono text-xs">
                        {att.punchOutTime || "On Duty"}
                      </strong>
                    </div>
                  </div>

                  {/* Site & Selfies Row */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate text-[11px] font-semibold">{att.siteName || proj?.name || "Main Site"}</span>
                    </div>

                    {/* Selfie Thumbnails */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {att.punchInSelfie && (
                        <img
                          src={att.punchInSelfie}
                          alt="In Selfie"
                          title="Click to view Punch IN Selfie"
                          onClick={() => setPreviewSelfieUrl(att.punchInSelfie)}
                          className="w-8 h-8 rounded-lg object-cover border-2 border-emerald-500 cursor-pointer shadow-xs"
                        />
                      )}
                      {att.punchOutSelfie && (
                        <img
                          src={att.punchOutSelfie}
                          alt="Out Selfie"
                          title="Click to view Punch OUT Selfie"
                          onClick={() => setPreviewSelfieUrl(att.punchOutSelfie)}
                          className="w-8 h-8 rounded-lg object-cover border-2 border-rose-500 cursor-pointer shadow-xs"
                        />
                      )}
                    </div>
                  </div>

                  {/* Action Button: GPS Visuals Map */}
                  <button
                    onClick={() => setGpsModalRecord(att)}
                    className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-2 border border-blue-200 dark:border-slate-700 transition-all btn-touch cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Verify GPS Location Maps</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────
              2. FULL TABLE VIEW
          ───────────────────────────────────────────────────────── */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Labour Name & Code</th>
                  <th className="p-4">Selfie Photos</th>
                  <th className="p-4">Site / Project</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Punch In</th>
                  <th className="p-4">Punch Out</th>
                  <th className="p-4">GPS Verification (In / Out)</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredAttendance.map((att) => {
                  const emp = employees.find((e) => e.id === att.employeeId);
                  const proj = projects.find((p) => p.id === att.projectId);
                  const isLate = att.status === "late";
                  const isOtApproved = att.overtimeStatus === "approved";

                  return (
                    <tr
                      key={att.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      {/* 1. Labour Name */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          {emp?.name || "Labour"}
                        </div>
                        <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                          EMP-{emp?.employeeCode} • {emp?.designation}
                        </div>
                      </td>

                      {/* 2. Selfie Photos (Punch In & Out) */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {att.punchInSelfie ? (
                            <div className="text-center">
                              <img
                                src={att.punchInSelfie}
                                alt="Punch In Selfie"
                                onClick={() => setPreviewSelfieUrl(att.punchInSelfie)}
                                className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-500 cursor-pointer shadow-sm hover:scale-105 transition-all"
                              />
                              <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">IN</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">No Photo</span>
                          )}

                          {att.punchOutSelfie && (
                            <div className="text-center">
                              <img
                                src={att.punchOutSelfie}
                                alt="Punch Out Selfie"
                                onClick={() => setPreviewSelfieUrl(att.punchOutSelfie)}
                                className="w-11 h-11 rounded-xl object-cover border-2 border-rose-500 cursor-pointer shadow-sm hover:scale-105 transition-all"
                              />
                              <span className="text-[9px] font-bold text-rose-600 block mt-0.5">OUT</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 3. Site / Project */}
                      <td className="p-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{att.siteName || proj?.name}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{proj?.locationName}</div>
                      </td>

                      {/* 4. Date */}
                      <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {att.date}
                      </td>

                      {/* 5. Punch In */}
                      <td className="p-4 font-mono font-bold text-emerald-600">
                        {att.punchInTime}
                      </td>

                      {/* 6. Punch Out */}
                      <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {att.punchOutTime || <span className="text-amber-600 font-sans text-xs">On Duty</span>}
                      </td>

                      {/* 7. GPS Verification (In/Out Visuals Trigger) */}
                      <td className="p-4">
                        <button
                          onClick={() => setGpsModalRecord(att)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-700 dark:text-blue-400 font-extrabold text-[11px] flex items-center gap-1.5 border border-blue-200 dark:border-slate-700 shadow-sm transition-all btn-touch cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>View Map Visuals</span>
                        </button>
                        <div className="text-[9px] font-mono text-slate-400 mt-1">
                          In: {att.punchInLat ? `${att.punchInLat}, ${att.punchInLng}` : "Logged"}
                        </div>
                      </td>

                      {/* 8. Status */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-block ${
                              isLate
                                ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300"
                                : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300"
                            }`}
                          >
                            {isLate ? "Late Arrival" : "On Time"}
                          </span>

                          {isOtApproved && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-600 text-white block text-center">
                              +OT Approved
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────
          GPS VERIFICATION MODAL: DUAL VISUAL MAPS WITH PINPOINT
      ───────────────────────────────────────────────────────── */}
      {gpsModalRecord && (
        <div
          className="modal-overlay"
          onClick={() => setGpsModalRecord(null)}
        >
          <div
            className="app-panel modal-dialog max-w-2xl shadow-2xl animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    GPS Location Verification & Visual Maps
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pinpointed map visuals for Punch IN and Punch OUT events.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGpsModalRecord(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="modal-body p-5 space-y-4 text-xs">

            {/* Worker Summary Info */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {employees.find((e) => e.id === gpsModalRecord.employeeId)?.name}
                </span>
                <span className="text-slate-500 ml-2">Date: {gpsModalRecord.date}</span>
              </div>
              <div className="font-bold text-blue-600 dark:text-blue-400">
                Site: {gpsModalRecord.siteName}
              </div>
            </div>

            {/* DUAL MAPS CONTAINER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 🟢 MAP 1: PUNCH IN LOCATION */}
              <div className="app-card p-4 rounded-2xl space-y-3 border-2 border-emerald-500/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="font-extrabold text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      1. Punch IN Map Visual
                    </h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    {gpsModalRecord.punchInTime}
                  </span>
                </div>

                {/* Visual Map Iframe */}
                <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 aspect-video relative bg-slate-100 dark:bg-slate-900">
                  {gpsModalRecord.punchInLat && gpsModalRecord.punchInLng ? (
                    <iframe
                      title="Punch In Map"
                      src={getMapEmbedUrl(gpsModalRecord.punchInLat, gpsModalRecord.punchInLng)}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-400 text-xs">
                      <MapPin className="w-8 h-8 text-emerald-500 mb-1" />
                      <span>GPS Coordinates Tagged at Project Site</span>
                    </div>
                  )}
                </div>

                {/* Coordinates & Navigation Link */}
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      Coordinates: <span className="font-mono text-emerald-600">{gpsModalRecord.punchInLat || "28.6139"}, {gpsModalRecord.punchInLng || "77.2090"}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {gpsModalRecord.punchInAddress || gpsModalRecord.siteName}
                    </div>
                  </div>

                  <a
                    href={getGoogleMapsLink(gpsModalRecord.punchInLat || 28.6139, gpsModalRecord.punchInLng || 77.2090)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>

              {/* 🔴 MAP 2: PUNCH OUT LOCATION */}
              <div className="app-card p-4 rounded-2xl space-y-3 border-2 border-rose-500/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <h4 className="font-extrabold text-xs text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                      2. Punch OUT Map Visual
                    </h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-600">
                    {gpsModalRecord.punchOutTime || "On Duty"}
                  </span>
                </div>

                {/* Visual Map Iframe or Pending Status */}
                <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 aspect-video relative bg-slate-100 dark:bg-slate-900">
                  {gpsModalRecord.punchOutLat && gpsModalRecord.punchOutLng ? (
                    <iframe
                      title="Punch Out Map"
                      src={getMapEmbedUrl(gpsModalRecord.punchOutLat, gpsModalRecord.punchOutLng)}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-400 text-xs">
                      <Clock className="w-8 h-8 text-amber-500 mb-1 animate-pulse" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">Currently on Duty</span>
                      <span className="text-[10px] text-slate-500">Punch Out map will render upon checkout</span>
                    </div>
                  )}
                </div>

                {/* Coordinates & Navigation Link */}
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      Coordinates:{" "}
                      <span className="font-mono text-rose-600">
                        {gpsModalRecord.punchOutLat
                          ? `${gpsModalRecord.punchOutLat}, ${gpsModalRecord.punchOutLng}`
                          : "Pending Punch Out"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {gpsModalRecord.punchOutAddress || "Site checkout verification pending"}
                    </div>
                  </div>

                  {gpsModalRecord.punchOutLat ? (
                    <a
                      href={getGoogleMapsLink(gpsModalRecord.punchOutLat, gpsModalRecord.punchOutLng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Google Maps</span>
                    </a>
                  ) : (
                    <div className="py-2 text-center text-[10px] text-slate-400 font-semibold">
                      Awaiting end-of-shift punch
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Close modal-body */}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <button
                type="button"
                onClick={() => setGpsModalRecord(null)}
                className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 font-bold text-xs text-slate-800 dark:text-slate-200 btn-touch cursor-pointer"
              >
                Close Map Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          FULL SELFIE PREVIEW MODAL
      ───────────────────────────────────────────────────────── */}
      {previewSelfieUrl && (
        <div
          className="modal-overlay"
          onClick={() => setPreviewSelfieUrl(null)}
        >
          <div className="max-w-sm w-full app-panel p-4 rounded-3xl space-y-3 shadow-2xl animate-in fade-in my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Live Selfie Snapshot</h3>
              <button onClick={() => setPreviewSelfieUrl(null)} className="cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <img src={previewSelfieUrl} alt="Selfie Full" className="w-full rounded-2xl border-2 border-blue-600 object-cover" />
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          DAILY ATTENDANCE ROSTER RECEIPT MODAL
      ───────────────────────────────────────────────────────── */}
      {showRosterReceiptModal && (
        <ReceiptModal
          isOpen={showRosterReceiptModal}
          onClose={() => setShowRosterReceiptModal(false)}
          title={`Daily Attendance Audit Roster - ${selectedDate}`}
          fileName={`Attendance_Audit_Roster_${selectedDate}`}
        >
          <AttendanceRosterReceipt date={selectedDate} records={filteredAttendance} />
        </ReceiptModal>
      )}
    </div>
  );
};
