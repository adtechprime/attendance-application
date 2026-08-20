import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { FileText, Camera, CheckCircle2, Sparkles, Building2 } from "lucide-react";

export const DailyWorkReportSubmission = () => {
  const { activeEmployee, projects, submitDailyReport, showToast } = useApp();
  const assignedProject = projects.find((p) => p.id === activeEmployee?.assignedProjectId) || projects[0];

  const [form, setForm] = useState({
    workCompleted: "",
    workPending: "",
    problemsFaced: "",
    materialRequired: "",
    siteObservations: "",
    taskCompletionStatus: "100% Completed",
  });

  const [photos, setPhotos] = useState([
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80",
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitDailyReport({
      employeeId: activeEmployee.id,
      projectId: assignedProject.id,
      workCompleted: form.workCompleted,
      workPending: form.workPending,
      problemsFaced: form.problemsFaced,
      materialRequired: form.materialRequired,
      siteObservations: form.siteObservations,
      taskCompletionStatus: form.taskCompletionStatus,
      photos,
    });
    showToast("✓ Daily Work Completion Report submitted successfully to Javed Contractor!", "success");
    setForm({
      workCompleted: "",
      workPending: "",
      problemsFaced: "",
      materialRequired: "",
      siteObservations: "",
      taskCompletionStatus: "100% Completed",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="app-panel p-6 rounded-3xl text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Daily Work Completion Report
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Mandatory end-of-day site report for <strong className="text-slate-900 dark:text-slate-100">{activeEmployee?.name}</strong> at {assignedProject?.name}.
        </p>
      </div>

      {/* Main Report Form */}
      <form onSubmit={handleSubmit} className="app-card p-6 rounded-3xl space-y-4 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">1. Work Completed Today *</label>
          <textarea
            required
            rows="3"
            placeholder="Describe tasks completed on site today..."
            value={form.workCompleted}
            onChange={(e) => setForm({ ...form, workCompleted: e.target.value })}
            className="w-full app-input p-3 rounded-xl"
          ></textarea>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">2. Work Pending for Tomorrow</label>
          <textarea
            rows="2"
            placeholder="Any unfinished items or upcoming steps..."
            value={form.workPending}
            onChange={(e) => setForm({ ...form, workPending: e.target.value })}
            className="w-full app-input p-3 rounded-xl"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">3. Material Required</label>
            <input
              type="text"
              placeholder="e.g. 2 rolls 2.5mm wire, 50 cable ties"
              value={form.materialRequired}
              onChange={(e) => setForm({ ...form, materialRequired: e.target.value })}
              className="w-full app-input p-3 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">4. Problems / Site Issues Faced</label>
            <input
              type="text"
              placeholder="e.g. Fluctuation in site power supply"
              value={form.problemsFaced}
              onChange={(e) => setForm({ ...form, problemsFaced: e.target.value })}
              className="w-full app-input p-3 rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">5. Site Safety & Observations</label>
          <input
            type="text"
            placeholder="e.g. Site clean and safe at wrap up"
            value={form.siteObservations}
            onChange={(e) => setForm({ ...form, siteObservations: e.target.value })}
            className="w-full app-input p-3 rounded-xl"
          />
        </div>

        {/* Photo Upload Zone */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className="block text-slate-700 dark:text-slate-300 mb-2 font-bold">6. Site Work Photos Attached</label>
          <div className="flex flex-wrap gap-3">
            {photos.map((url, idx) => (
              <img key={idx} src={url} alt="Attached" className="w-24 h-24 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shadow" />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Submit Daily Report to Superadmin</span>
          </button>
        </div>
      </form>
    </div>
  );
};
