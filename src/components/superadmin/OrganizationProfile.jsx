import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import {
  Building2,
  Shield,
  KeyRound,
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Lock,
  Phone,
  Mail,
  MapPin,
  Award,
  Hash,
  ExternalLink,
  Sparkles,
  Edit3,
  X,
} from "lucide-react";

export const OrganizationProfile = () => {
  const { company, updateCompanyProfile, updateAdminPin, showToast } = useApp();

  // Edit Organization State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: company.name || "",
    logo: company.logo || "",
    contractorName: company.contractorName || "",
    address: company.address || "",
    gstNo: company.gstNo || "",
    licenceNo: company.licenceNo || company.contractorCode || "",
    phone: company.phone || company.contractorMobile || "",
    email: company.email || company.contractorEmail || "",
  });

  // PIN Management State
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [pinForm, setPinForm] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: "",
  });
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);

  // Status & Feedback
  const [pinError, setPinError] = useState("");
  const fileInputRef = useRef(null);

  // 1. Handle Logo Image Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image size should be less than 2MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result;
      if (base64) {
        setFormData((prev) => ({ ...prev, logo: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 2. Handle Save Organization Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Organization name cannot be empty.", "error");
      return;
    }

    const updated = {
      name: formData.name.trim(),
      logo: formData.logo,
      contractorName: formData.contractorName.trim(),
      address: formData.address.trim(),
      gstNo: formData.gstNo.trim().toUpperCase(),
      licenceNo: formData.licenceNo.trim(),
      contractorCode: formData.licenceNo.trim(),
      phone: formData.phone.trim(),
      contractorMobile: formData.phone.trim(),
      email: formData.email.trim(),
      contractorEmail: formData.email.trim(),
    };

    updateCompanyProfile(updated);
    setIsEditingProfile(false);
    showToast("✓ Organization details updated across all documents & portals!", "success");
  };

  // 3. Handle PIN Update
  const handleUpdatePin = (e) => {
    e.preventDefault();
    setPinError("");

    const currentActualPin = String(company.adminPin || "1234").trim();

    if (pinForm.currentPin.trim() !== currentActualPin) {
      setPinError("Current PIN is incorrect.");
      return;
    }

    if (!/^\d{4}$/.test(pinForm.newPin.trim())) {
      setPinError("New PIN must be exactly 4 numeric digits (e.g. 5821).");
      return;
    }

    if (pinForm.newPin.trim() !== pinForm.confirmPin.trim()) {
      setPinError("New PIN and confirmation PIN do not match.");
      return;
    }

    updateAdminPin(pinForm.newPin.trim());
    setPinForm({ currentPin: "", newPin: "", confirmPin: "" });
    setIsEditingPin(false);
    showToast("✓ 4-digit Superadmin security PIN updated successfully!", "success");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans animate-in fade-in">

      {/* ─────────────────────────────────────────────────────────
          1. TOP BANNER & QUICK ACTIONS
      ───────────────────────────────────────────────────────── */}
      <div className="app-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Logo / Avatar */}
            {company.logo ? (
              <div className="relative group">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-contain bg-white border-2 border-blue-600 shadow-lg p-1.5"
                />
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black shadow-xl shrink-0">
                <Building2 className="w-10 h-10" />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {company.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                  Registered Contractor
                </span>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <span>Contractor / Signatory:</span>
                <strong className="text-slate-900 dark:text-slate-200">{company.contractorName}</strong>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                {company.gstNo && (
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    GST: {company.gstNo}
                  </span>
                )}
                {(company.licenceNo || company.contractorCode) && (
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    Lic: {company.licenceNo || company.contractorCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
            <button
              onClick={() => {
                setFormData({
                  name: company.name || "",
                  logo: company.logo || "",
                  contractorName: company.contractorName || "",
                  address: company.address || "",
                  gstNo: company.gstNo || "",
                  licenceNo: company.licenceNo || company.contractorCode || "",
                  phone: company.phone || company.contractorMobile || "",
                  email: company.email || company.contractorEmail || "",
                });
                setIsEditingProfile(true);
              }}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 btn-touch transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Organization</span>
            </button>

            <button
              onClick={() => {
                setPinForm({ currentPin: "", newPin: "", confirmPin: "" });
                setPinError("");
                setIsEditingPin(true);
              }}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 btn-touch transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Update PIN</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          2. DUAL-COLUMN GRID: ORGANIZATION CREDENTIALS & SECURITY
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Organization Details (2 Cols Wide) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="app-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Organization & Legal Registration
                </h3>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active on All Records</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Award className="w-3 h-3 text-blue-600" /> Organization Full Name
                </span>
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  {company.name}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-600" /> Contractor / Signatory
                </span>
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  {company.contractorName}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Hash className="w-3 h-3 text-blue-600" /> GSTIN Registration Number
                </span>
                <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  {company.gstNo || "Not Specified"}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Award className="w-3 h-3 text-blue-600" /> Civil Contractor Licence No.
                </span>
                <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  {company.licenceNo || company.contractorCode || "Not Specified"}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Phone className="w-3 h-3 text-blue-600" /> Helpline & Contact
                </span>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {company.phone || company.contractorMobile || "Not Specified"}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Mail className="w-3 h-3 text-blue-600" /> Official Corporate Email
                </span>
                <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                  {company.email || company.contractorEmail || "Not Specified"}
                </div>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-600" /> Registered Office / Yard Address
                </span>
                <div className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {company.address || "Address not provided"}
                </div>
              </div>
            </div>

            {/* Note on sync across all features */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Global Application Synchronization:</strong> Any changes made to your organization
                name, logo, address, GSTIN, or license will immediately reflect across all{" "}
                <strong>Employee ID Badges, Salary Slips, Daily Attendance Rosters, Payment Vouchers, and Login Headers</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security & PIN Management Card */}
        <div className="space-y-6">
          <div className="app-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Lock className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Superadmin Security PIN
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Active Security PIN</div>
                  <div className="text-lg font-black font-mono text-slate-900 dark:text-slate-100 tracking-widest mt-0.5">
                    {showCurrentPin ? (company.adminPin || "1234") : "••••"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCurrentPin(!showCurrentPin)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  title="Toggle PIN visibility"
                >
                  {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                This 4-digit passcode is used by the contractor/proprietor to access the Superadmin portal.
              </p>
            </div>

            <button
              onClick={() => {
                setPinForm({ currentPin: "", newPin: "", confirmPin: "" });
                setPinError("");
                setIsEditingPin(true);
              }}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 btn-touch transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change 4-Digit Passcode</span>
            </button>
          </div>

          {/* Quick System Info */}
          <div className="app-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Contractor Portal Status</span>
            </div>
            <div className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <div className="flex justify-between">
                <span>System Role:</span>
                <strong className="text-blue-700 dark:text-blue-400">Superadmin Controller</strong>
              </div>
              <div className="flex justify-between">
                <span>Database Sync:</span>
                <strong className="text-emerald-600">Online & Synchronized</strong>
              </div>
              <div className="flex justify-between">
                <span>Print Isolation:</span>
                <strong className="text-slate-900 dark:text-slate-200">Enabled (Clean A4)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          3. EDIT ORGANIZATION PROFILE MODAL
      ───────────────────────────────────────────────────────── */}
      {isEditingProfile && (
        <div className="modal-overlay">
          <div className="app-panel modal-dialog max-w-2xl shadow-2xl animate-in fade-in">
            <div className="modal-header p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  Edit Organization Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="modal-body p-5 sm:p-6 space-y-4 text-xs">
                {/* Logo Upload Box */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Organization Logo (Appears on Receipts, ID Badges & Headers)
                  </label>
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Logo Preview"
                        className="w-14 h-14 rounded-xl object-contain bg-white border border-slate-300 shadow-sm p-1"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload-input"
                        />
                        <label
                          htmlFor="logo-upload-input"
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm btn-touch"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Logo</span>
                        </label>

                        {formData.logo && (
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Recommended format: PNG / JPG / SVG with transparent or solid background.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Organization Name & Contractor Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Organization / Company Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. AdTech Prime Infrastructure"
                      className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contractor / Proprietor Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contractorName}
                      onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
                      placeholder="e.g. Javed Contractor"
                      className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                {/* GSTIN & Licence Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      GSTIN Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.gstNo}
                      onChange={(e) => setFormData({ ...formData, gstNo: e.target.value.toUpperCase() })}
                      placeholder="e.g. 27AAACA1234A1Z5"
                      className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contractor Civil / Labour Licence No.
                    </label>
                    <input
                      type="text"
                      value={formData.licenceNo}
                      onChange={(e) => setFormData({ ...formData, licenceNo: e.target.value })}
                      placeholder="e.g. LIC-CIVIL-MH-2026-9812"
                      className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Official Phone / Helpline
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Official Corporate Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. admin@adtechprime.com"
                      className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Office / Yard Address */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registered Office / Work Yard Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Plot 42, Civil Hub, Dadar West, Mumbai, MH - 400028"
                    className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-footer p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold flex items-center gap-1.5 shadow-md shadow-blue-600/20 btn-touch cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Organization Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          4. UPDATE 4-DIGIT PIN SECURITY MODAL
      ───────────────────────────────────────────────────────── */}
      {isEditingPin && (
        <div className="modal-overlay">
          <div className="app-panel modal-dialog max-w-md shadow-2xl animate-in fade-in">
            <div className="modal-header p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  Change 4-Digit Security PIN
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingPin(false)}
                className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePin} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="modal-body p-5 sm:p-6 space-y-4 text-xs">
                {pinError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{pinError}</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enter Current 4-Digit PIN
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={pinForm.currentPin}
                    onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value })}
                    placeholder="Current PIN (Default: 1234)"
                    className="w-full app-input px-3.5 py-2.5 rounded-xl font-mono text-sm tracking-widest text-center"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enter New 4-Digit PIN
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={pinForm.newPin}
                    onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
                    placeholder="New 4 Digits"
                    className="w-full app-input px-3.5 py-2.5 rounded-xl font-mono text-sm tracking-widest text-center"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New 4-Digit PIN
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={pinForm.confirmPin}
                    onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
                    placeholder="Confirm New 4 Digits"
                    className="w-full app-input px-3.5 py-2.5 rounded-xl font-mono text-sm tracking-widest text-center"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-footer p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditingPin(false)}
                  className="py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 btn-touch cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update PIN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
