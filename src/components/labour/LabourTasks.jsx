import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CheckSquare, CheckCircle2, Clock, Camera, AlertCircle, X } from "lucide-react";

export const LabourTasks = () => {
  const { activeEmployee, tasks, updateTaskStatus, showToast } = useApp();
  const myTasks = tasks.filter((t) => t.assignedToId === activeEmployee?.id);

  const [selectedTask, setSelectedTask] = useState(null);
  const [progressNotes, setProgressNotes] = useState("");

  const handleMarkComplete = (task) => {
    setSelectedTask(task);
    setProgressNotes(task.progressNotes || "");
  };

  const handleSaveProgress = (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    updateTaskStatus(selectedTask.id, "completed", progressNotes);
    setSelectedTask(null);
    showToast("✓ Task marked as completed!", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="app-panel p-6 rounded-3xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600 dark:text-sky-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              My Assigned Daily Tasks
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Review site assignments given by Javed Contractor and submit work completion updates.
          </p>
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myTasks.length === 0 ? (
          <div className="col-span-full app-card p-8 rounded-2xl text-center text-slate-500 dark:text-slate-400 text-xs">
            No active tasks assigned to you right now.
          </div>
        ) : (
          myTasks.map((t) => (
            <div key={t.id} className="app-card p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.priority === "high" ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400" : "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {t.priority} Priority
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">Due: {t.deadline}</span>
                </div>

                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base mt-2">{t.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{t.description}</p>

                {t.progressNotes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <strong>My Update:</strong> {t.progressNotes}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Status: {t.status}</span>
                {t.status !== "completed" ? (
                  <button
                    onClick={() => handleMarkComplete(t)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Complete</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Progress Update Modal */}
      {selectedTask && (
        <div className="modal-overlay">
          <div className="app-panel modal-dialog max-w-md shadow-2xl animate-in fade-in">
            <div className="modal-header p-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  Task Completion
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Update Task Completion
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgress} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="modal-body p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
                  <input
                    type="text"
                    disabled
                    value={selectedTask.title}
                    className="w-full app-input p-3 rounded-xl font-bold opacity-75 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Work Done Remarks / Progress Notes <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe work finished today..."
                    value={progressNotes}
                    onChange={(e) => setProgressNotes(e.target.value)}
                    className="w-full app-input p-3 rounded-xl"
                  />
                </div>
              </div>

              <div className="modal-footer p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="py-3 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 btn-touch cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md btn-touch cursor-pointer"
                >
                  Submit Completion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
