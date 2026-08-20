import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  CheckSquare,
  FileText,
  Plus,
  Clock,
  AlertTriangle,
  User,
  FolderGit2,
  Users,
  Camera,
  X,
} from "lucide-react";

export const TaskAndReportManager = () => {
  const { tasks, dailyReports, employees, projects, groups, addTask } = useApp();
  const [activeTab, setActiveTab] = useState("reports"); // 'reports' | 'tasks'
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedToType: "employee",
    assignedToId: employees[0]?.id || "",
    projectId: projects[0]?.id || "",
    deadline: new Date().toISOString().split("T")[0],
    priority: "high",
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    addTask(taskForm);
    setShowTaskModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 app-panel p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600 dark:text-amber-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Daily Tasks & Work Completion Reports
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Assign daily site tasks to labour/squads and review mandatory end-of-day work completion reports with site photos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "reports"
                  ? "bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Daily Work Reports ({dailyReports.length})
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "tasks"
                  ? "bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Task Assignment Board ({tasks.length})
            </button>
          </div>

          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Task</span>
          </button>
        </div>
      </div>

      {/* DAILY WORK REPORTS TAB */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Submitted End-of-Day Labour Reports</h3>

          <div className="space-y-4">
            {dailyReports.map((rep) => {
              const emp = employees.find((e) => e.id === rep.employeeId);
              const proj = projects.find((p) => p.id === rep.projectId);

              return (
                <div key={rep.id} className="app-card p-5 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp?.avatar}
                        alt={emp?.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{emp?.name}</div>
                        <div className="text-[10px] text-blue-700 dark:text-amber-400 font-mono font-bold">
                          EMP-{emp?.employeeCode} • {proj?.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
                      <span>Submitted: <strong className="text-slate-900 dark:text-slate-100">{rep.date}</strong></span>
                      <span className="px-2.5 py-0.5 rounded bg-sky-100 dark:bg-sky-500/10 text-sky-800 dark:text-sky-400 font-bold uppercase text-[10px]">
                        {rep.status}
                      </span>
                    </div>
                  </div>

                  {/* Report Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block mb-1">Work Completed Today:</span>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{rep.workCompleted}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase block mb-1">Pending Work:</span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{rep.workPending || "None"}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase block mb-1">Material Required for Tomorrow:</span>
                        <p className="text-purple-900 dark:text-purple-300 font-semibold">{rep.materialRequired || "None specified"}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase block mb-1">Problems / Site Issues Faced:</span>
                        <p className="text-slate-700 dark:text-slate-300">{rep.problemsFaced || "No site issues encountered"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Photo Grid */}
                  {rep.photos && rep.photos.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 block mb-2 font-bold uppercase">Submitted Site Work Photographs:</span>
                      <div className="flex flex-wrap gap-3">
                        {rep.photos.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Site Photo ${idx + 1}`}
                            className="h-28 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shadow"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TASKS ASSIGNMENT BOARD TAB */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Active Site Task Board</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tasks.map((t) => {
              const emp = employees.find((e) => e.id === t.assignedToId);
              const grp = groups.find((g) => g.id === t.assignedToId);

              return (
                <div key={t.id} className="app-card p-5 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.priority === "high"
                            ? "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400"
                            : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        {t.priority} Priority
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{t.status}</span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mt-2">{t.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{t.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span>Assigned To: <strong className="text-slate-900 dark:text-slate-200">{emp?.name || grp?.name || "Labour"}</strong></span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">Due: {t.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="app-panel modal-dialog max-w-md shadow-2xl animate-in fade-in">
            <div className="modal-header p-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  Task Dispatch
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Assign New Site Task
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="modal-body p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Task Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lay Main Power Cables"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Description / Instructions <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Detailed instructions for site work..."
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full app-input p-3 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Assign To <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={taskForm.assignedToId}
                      onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value })}
                      className="w-full app-input p-3 rounded-xl cursor-pointer font-semibold"
                    >
                      {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name} (EMP-{e.employeeCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Priority <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="w-full app-input p-3 rounded-xl cursor-pointer font-semibold"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Deadline Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="modal-footer p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="py-3 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 btn-touch cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md btn-touch cursor-pointer"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
