import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Users,
  UserPlus,
  Search,
  Building2,
  Phone,
  Shield,
  CreditCard,
  CheckCircle2,
  XCircle,
  QrCode,
  Calendar,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Trash2,
  Edit3,
  X,
  PhoneCall,
  FileCheck,
  Printer,
  Camera,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { ReceiptModal } from "../common/ReceiptModal";
import { LabourIDCardReceipt } from "../receipts/LabourIDCardReceipt";

export const EmployeeManagement = ({ onSelectEmployeeProfile }) => {
  const { employees, projects, groups, addEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus, showToast } = useApp();

  const [viewMode, setViewMode] = useState("list"); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSiteFilter, setSelectedSiteFilter] = useState("all");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteConfirmEmp, setDeleteConfirmEmp] = useState(null);
  const [selectedEmpForIdCard, setSelectedEmpForIdCard] = useState(null);

  // Helper for 1-year default validity date
  const getDefaultValidityDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  };

  // Form State for Employee Enrollment / Edit
  const initialFormState = {
    avatar: "",
    name: "",
    mobile: "",
    alternateMobile: "",
    govtIdType: "Aadhaar Card",
    govtIdNumber: "",
    designation: "Mason",
    salary: 600, // Daily wage rate in INR
    assignedProjectIds: projects.length > 0 ? [projects[0].id] : [],
    assignedGroupId: groups[0]?.id || "",
    address: "",
    emergencyContact: "",
    cardValidity: getDefaultValidityDate(),
  };

  const [formData, setFormData] = useState(initialFormState);

  // Photo Upload Handler (Converts file to Base64)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Please select a photo smaller than 5MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Image = uploadEvent.target?.result;
      if (base64Image) {
        setFormData((prev) => ({
          ...prev,
          avatar: base64Image,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove Photo Handler
  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: "",
    }));
  };

  // Quick Renewal / Extend Validity Helper
  const handleExtendValidity = (yearsToAdd) => {
    const baseDate = formData.cardValidity ? new Date(formData.cardValidity) : new Date();
    baseDate.setFullYear(baseDate.getFullYear() + yearsToAdd);
    setFormData((prev) => ({
      ...prev,
      cardValidity: baseDate.toISOString().split("T")[0],
    }));
  };

  // Open Edit Modal
  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      avatar: emp.avatar || "",
      name: emp.name || "",
      mobile: emp.mobile || "",
      alternateMobile: emp.alternateMobile || "",
      govtIdType: emp.govtIdType || "Aadhaar Card",
      govtIdNumber: emp.govtIdNumber || "",
      designation: emp.designation || "Mason",
      salary: emp.salary || 600,
      assignedProjectIds: emp.assignedProjectIds || (emp.assignedProjectId ? [emp.assignedProjectId] : [projects[0]?.id]),
      assignedGroupId: emp.assignedGroupId || groups[0]?.id || "",
      address: emp.address || "",
      emergencyContact: emp.emergencyContact || emp.alternateMobile || "",
      cardValidity: emp.cardValidity || getDefaultValidityDate(),
    });
  };

  // Toggle Project Site checkbox in multi-select
  const handleToggleProject = (projId) => {
    setFormData((prev) => {
      const exists = prev.assignedProjectIds.includes(projId);
      let updated;
      if (exists) {
        // Keep at least one site if possible
        updated = prev.assignedProjectIds.filter((id) => id !== projId);
        if (updated.length === 0) updated = [projId];
      } else {
        updated = [...prev.assignedProjectIds, projId];
      }
      return {
        ...prev,
        assignedProjectIds: updated,
        assignedProjectId: updated[0], // primary site fallback
      };
    });
  };

  // Submit Enrollment
  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Please enter worker full name", "error");
      return;
    }
    if (formData.assignedProjectIds.length === 0) {
      showToast("Please assign at least one project site", "error");
      return;
    }

    const avatarToSave = formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "Worker")}&background=1d4ed8&color=ffffff&size=200&bold=true`;

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, {
        ...formData,
        avatar: avatarToSave,
        salary: Number(formData.salary) || 600,
        assignedProjectId: formData.assignedProjectIds[0],
      });
      setEditingEmployee(null);
      showToast(`✓ Updated details for ${formData.name}`, "success");
    } else {
      const created = addEmployee({
        ...formData,
        avatar: avatarToSave,
        salary: Number(formData.salary) || 600,
        assignedProjectId: formData.assignedProjectIds[0],
      });
      setIsAddModalOpen(false);
      showToast(`✓ Successfully enrolled ${created.name}! Employee Code: EMP-${created.employeeCode}`, "success");
    }

    setFormData(initialFormState);
  };

  // Confirm Delete Action
  const handleDeleteConfirm = () => {
    if (deleteConfirmEmp) {
      deleteEmployee(deleteConfirmEmp.id);
      showToast(`✓ Employee ${deleteConfirmEmp.name} deleted successfully.`, "success");
      setDeleteConfirmEmp(null);
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.includes(searchQuery) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.mobile && emp.mobile.includes(searchQuery)) ||
      (emp.govtIdNumber && emp.govtIdNumber.includes(searchQuery));

    const empProjects = emp.assignedProjectIds || (emp.assignedProjectId ? [emp.assignedProjectId] : []);
    const matchesSite =
      selectedSiteFilter === "all" || empProjects.includes(selectedSiteFilter);

    return matchesSearch && matchesSite;
  });

  const designationsList = [
    "Mason (Rajmistri)",
    "Electrician",
    "Plumber",
    "Carpenter (Badhai)",
    "Painter",
    "Welder",
    "Steel Binder (Sariya Mistri)",
    "General Helper / Beldar",
    "Site Supervisor / Mukadam",
    "Tile & Marble Mason",
    "Crane / Machine Operator",
  ];

  const govtIdOptions = [
    "Aadhaar Card",
    "Voter ID",
    "PAN Card",
    "Driving License",
    "Ration Card",
    "Passport",
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Top Header Card */}
      <div className="app-panel p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            Workforce Directory
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Labour Workforce Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enroll workers with full Government IDs, alternate phone numbers, daily wage rates, multi-site assignments, and trade squads.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingEmployee(null);
            setFormData(initialFormState);
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 btn-touch transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Enroll New Employee</span>
        </button>
      </div>

      {/* Search, Filter & View Toggle Bar */}
      <div className="app-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by worker name, 4-digit code, phone, Aadhaar, or trade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full app-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Site Filter Dropdown */}
          <select
            value={selectedSiteFilter}
            onChange={(e) => setSelectedSiteFilter(e.target.value)}
            className="app-input px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer flex-1 sm:flex-initial"
          >
            <option value="all">All Sites / Projects</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>

          {/* View Mode Switcher: Grid vs List */}
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
      {filteredEmployees.length === 0 ? (
        <div className="app-card p-12 rounded-3xl text-center space-y-3">
          <Users className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Employees Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {employees.length === 0
              ? "Start by enrolling your first labour worker to generate their 4-digit code and ID credentials."
              : "No employees match your search query or site filter."}
          </p>
          <button
            onClick={() => {
              setEditingEmployee(null);
              setFormData(initialFormState);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Employee</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* ─────────────────────────────────────────────────────────
            1. GRID / CARD VIEW
        ───────────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => {
            const empProjectIds = emp.assignedProjectIds || (emp.assignedProjectId ? [emp.assignedProjectId] : []);
            const assignedSites = projects.filter((p) => empProjectIds.includes(p.id));
            const grp = groups.find((g) => g.id === emp.assignedGroupId);

            return (
              <div
                key={emp.id}
                className="app-card p-5 rounded-3xl space-y-4 hover:border-blue-500 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top: Avatar, Name, Code */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-600 shadow"
                      />
                      <div>
                        <h4
                          onClick={() => onSelectEmployeeProfile(emp.id)}
                          className="font-extrabold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 cursor-pointer"
                        >
                          {emp.name}
                        </h4>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{emp.designation}</div>
                      </div>
                    </div>

                    <span className="font-mono font-black text-xs bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-xl border border-blue-200 dark:border-slate-700 shrink-0">
                      EMP-{emp.employeeCode}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Daily Rate:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        ₹{Number(emp.salary || 600).toLocaleString("en-IN")} / Day
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Govt ID:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                        {emp.govtIdType || "Aadhaar"}: {emp.govtIdNumber || "Verified"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Primary Phone:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{emp.mobile || "—"}</span>
                    </div>

                    {emp.alternateMobile && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Alternate Phone:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{emp.alternateMobile}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Team:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                        {grp?.name || "General Team"}
                      </span>
                    </div>

                    {/* Assigned Project Sites (Multiple) */}
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase tracking-wider">
                        Assigned Project Sites ({assignedSites.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {assignedSites.map((site) => (
                          <span
                            key={site.id}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-800 dark:text-slate-200"
                          >
                            {site.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Toolbar: Status, Edit, Delete, Profile */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleEmployeeStatus(emp.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        emp.status === "active"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {emp.status === "active" ? "Active" : "Inactive"}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(emp)}
                      title="Edit Employee"
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-400 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedEmpForIdCard(emp)}
                      title="Print / Save Official ID Badge"
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-400 transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmEmp(emp)}
                      title="Delete Employee"
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectEmployeeProfile(emp.id)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
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
                  <th className="p-4">Labour Name & Code</th>
                  <th className="p-4">Trade & Rate</th>
                  <th className="p-4">Phone Numbers</th>
                  <th className="p-4">Government ID</th>
                  <th className="p-4">Assigned Sites</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredEmployees.map((emp) => {
                  const empProjectIds = emp.assignedProjectIds || (emp.assignedProjectId ? [emp.assignedProjectId] : []);
                  const assignedSites = projects.filter((p) => empProjectIds.includes(p.id));

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      {/* Name & Code */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-9 h-9 rounded-xl object-cover border border-blue-600 shrink-0"
                          />
                          <div>
                            <div
                              onClick={() => onSelectEmployeeProfile(emp.id)}
                              className="font-extrabold text-slate-900 dark:text-slate-100 hover:text-blue-600 cursor-pointer"
                            >
                              {emp.name}
                            </div>
                            <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                              EMP-{emp.employeeCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Trade & Rate */}
                      <td className="p-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{emp.designation}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          ₹{Number(emp.salary || 600).toLocaleString("en-IN")}/d
                        </div>
                      </td>

                      {/* Phone Numbers */}
                      <td className="p-4">
                        <div className="font-mono text-slate-800 dark:text-slate-200">{emp.mobile || "—"}</div>
                        {emp.alternateMobile && (
                          <div className="text-[10px] font-mono text-slate-400">Alt: {emp.alternateMobile}</div>
                        )}
                      </td>

                      {/* Govt ID */}
                      <td className="p-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {emp.govtIdType || "Aadhaar"}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500">
                          {emp.govtIdNumber || "Verified"}
                        </div>
                      </td>

                      {/* Assigned Sites (Multiple) */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {assignedSites.map((site) => (
                            <span
                              key={site.id}
                              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-medium"
                            >
                              {site.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => toggleEmployeeStatus(emp.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                            emp.status === "active"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {emp.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            title="Edit"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-400 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setSelectedEmpForIdCard(emp)}
                            title="Print / Save Official ID Badge"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-400 transition-all"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmEmp(emp)}
                            title="Delete"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-500 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onSelectEmployeeProfile(emp.id)}
                            title="View 360 Profile"
                            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition-all"
                          >
                            Profile
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
          ENROLL / EDIT EMPLOYEE MODAL (OPTIMIZED SCREEN FIT)
      ───────────────────────────────────────────────────────── */}
      {(isAddModalOpen || editingEmployee) && (
        <div className="modal-overlay">
          <div className="app-panel modal-dialog max-w-lg shadow-2xl animate-in fade-in">
            {/* Modal Header */}
            <div className="modal-header p-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  {editingEmployee ? "Update Record" : "New Enrollment"}
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {editingEmployee ? `Edit Employee (${editingEmployee.name})` : "Enroll Labour Worker"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingEmployee(null);
                }}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form with Scrollable Body & Sticky Footer */}
            <form onSubmit={handleEnrollSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="modal-body p-5 space-y-3.5 text-xs">
                {/* 0. Worker Passport Photo Upload & Live Preview */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt={formData.name || "Worker Photo"}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-600 shadow-md bg-white"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-blue-400 flex flex-col items-center justify-center text-blue-600 shadow-inner">
                        <Camera className="w-6 h-6" />
                        <span className="text-[8.5px] font-bold mt-0.5">No Photo</span>
                      </div>
                    )}
                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        title="Remove Photo"
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-slate-900 dark:text-slate-100 text-xs block">
                        Worker ID Card Photo
                      </label>
                      <span className="text-[9.5px] text-blue-700 dark:text-blue-300 font-bold bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                        Passport / Badge
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{formData.avatar ? "Change Photo" : "Upload Photo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      {formData.avatar && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[11px] hover:bg-rose-200 transition-all cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">
                      This photo will print on the Employee ID Badge and appear in Attendance Rosters.
                    </p>
                  </div>
                </div>

                {/* 1. Full Name */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-bold text-sm"
                  />
                </div>

                {/* 2. Primary & Alternate Phone Numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Alternate / Emergency Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9123456780"
                      value={formData.alternateMobile}
                      onChange={(e) => setFormData({ ...formData, alternateMobile: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-mono"
                    />
                  </div>
                </div>

                {/* 3. Government ID Verification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Government ID Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.govtIdType}
                      onChange={(e) => setFormData({ ...formData, govtIdType: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-semibold cursor-pointer"
                    >
                      {govtIdOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Government ID Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 4589 1234 5678"
                      value={formData.govtIdNumber}
                      onChange={(e) => setFormData({ ...formData, govtIdNumber: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-mono"
                    />
                  </div>
                </div>

                {/* 4. Designation & Salary Assigned */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Designation / Trade Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-semibold cursor-pointer"
                    >
                      {designationsList.map((desig) => (
                        <option key={desig} value={desig}>
                          {desig}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Assigned Daily Salary (₹ / Day) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 600"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full app-input p-3 rounded-xl font-bold text-slate-900 dark:text-slate-100 font-mono"
                    />
                  </div>
                </div>

                {/* 5. Assigned Team / Squad */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Team / Squad
                  </label>
                  <select
                    value={formData.assignedGroupId}
                    onChange={(e) => setFormData({ ...formData, assignedGroupId: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-semibold cursor-pointer"
                  >
                    {groups.map((grp) => (
                      <option key={grp.id} value={grp.id}>
                        {grp.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Assigned Sites (MULTIPLE SELECTION SUPPORT) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Assigned Project Sites (Select Multiple) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-blue-600 font-bold">
                      {formData.assignedProjectIds.length} Selected
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 max-h-36 overflow-y-auto">
                    {projects.map((proj) => {
                      const isSelected = formData.assignedProjectIds.includes(proj.id);
                      return (
                        <div
                          key={proj.id}
                          onClick={() => handleToggleProject(proj.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 font-bold"
                              : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <div className="text-xs">{proj.name}</div>
                              <div className="text-[10px] text-slate-500">{proj.code} • {proj.locationName}</div>
                            </div>
                          </div>

                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-slate-400 dark:border-slate-600"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 7. ID Card Validity & Superadmin Renewal */}
                <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>ID Card Validity / Expiry Date</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                      Superadmin Managed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="date"
                      required
                      value={formData.cardValidity}
                      onChange={(e) => setFormData({ ...formData, cardValidity: e.target.value })}
                      className="w-full app-input p-2.5 rounded-xl font-mono font-bold text-xs"
                    />

                    {/* Quick Renewal Options */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleExtendValidity(1)}
                        title="Renew / Extend card by 1 year from current expiry"
                        className="flex-1 py-2 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 font-extrabold text-[10.5px] transition-all cursor-pointer"
                      >
                        +1 Yr Renew
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExtendValidity(2)}
                        title="Renew / Extend card by 2 years from current expiry"
                        className="flex-1 py-2 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 font-extrabold text-[10.5px] transition-all cursor-pointer"
                      >
                        +2 Yrs Renew
                      </button>
                    </div>
                  </div>

                  <p className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">
                    Renewal of the Employee ID card validity is controlled exclusively by the Superadmin.
                  </p>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="modal-footer p-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2.5 bg-slate-50 dark:bg-slate-900/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingEmployee(null);
                  }}
                  className="py-3 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 btn-touch cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md btn-touch cursor-pointer"
                >
                  {editingEmployee ? "Update Employee" : "Enroll Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          DELETE CONFIRMATION MODAL
      ───────────────────────────────────────────────────────── */}
      {deleteConfirmEmp && (
        <div className="modal-overlay">
          <div className="app-panel p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in text-center my-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Delete Employee Profile?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete <strong>{deleteConfirmEmp.name}</strong> (EMP-{deleteConfirmEmp.employeeCode})? This will remove the employee from the directory.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmEmp(null)}
                className="py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 btn-touch"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="py-2.5 rounded-xl font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-md btn-touch"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          CONTRACTOR LABOUR ID BADGE RECEIPT MODAL
      ───────────────────────────────────────────────────────── */}
      {selectedEmpForIdCard && (
        <ReceiptModal
          isOpen={!!selectedEmpForIdCard}
          onClose={() => setSelectedEmpForIdCard(null)}
          title={`Contractor ID Badge - ${selectedEmpForIdCard.name} (EMP-${selectedEmpForIdCard.employeeCode})`}
          fileName={`Labour_ID_Card_EMP-${selectedEmpForIdCard.employeeCode}_${selectedEmpForIdCard.name?.replace(/\s+/g, "_")}`}
        >
          <LabourIDCardReceipt employee={selectedEmpForIdCard} />
        </ReceiptModal>
      )}
    </div>
  );
};
