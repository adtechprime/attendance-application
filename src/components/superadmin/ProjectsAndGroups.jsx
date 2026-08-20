import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Building2,
  FolderGit2,
  PlusCircle,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  Briefcase,
  Layers,
  LayoutGrid,
  List as ListIcon,
  Edit3,
  Trash2,
  Search,
  X,
  UserCheck,
} from "lucide-react";

export const ProjectsAndGroups = () => {
  const {
    projects,
    groups,
    employees,
    addProject,
    updateProject,
    deleteProject,
    addGroup,
    updateGroup,
    deleteGroup,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState("sites"); // 'sites' | 'teams'
  const [viewMode, setViewMode] = useState("list"); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [deleteConfirmSite, setDeleteConfirmSite] = useState(null);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState(null);

  // Form states
  const initialSiteForm = {
    name: "",
    code: "",
    clientName: "",
    locationName: "",
    latitude: 28.6139,
    longitude: 77.2090,
  };

  const initialGroupForm = {
    name: "",
    projectId: projects[0]?.id || "",
    description: "",
  };

  const [siteForm, setSiteForm] = useState(initialSiteForm);
  const [groupForm, setGroupForm] = useState(initialGroupForm);

  // Open Edit Site Modal
  const handleOpenEditSite = (site) => {
    setEditingSite(site);
    setSiteForm({
      name: site.name || "",
      code: site.code || "",
      clientName: site.clientName || "",
      locationName: site.locationName || "",
      latitude: site.latitude || 28.6139,
      longitude: site.longitude || 77.2090,
    });
  };

  // Open Edit Group Modal
  const handleOpenEditGroup = (grp) => {
    setEditingGroup(grp);
    setGroupForm({
      name: grp.name || "",
      projectId: grp.projectId || projects[0]?.id || "",
      description: grp.description || "",
    });
  };

  // Submit Site Form (Create or Edit)
  const handleSaveSite = (e) => {
    e.preventDefault();
    if (!siteForm.name.trim()) {
      showToast("Please enter project site name", "error");
      return;
    }

    if (editingSite) {
      updateProject(editingSite.id, {
        ...siteForm,
      });
      setEditingSite(null);
      showToast(`✓ Site "${siteForm.name}" updated successfully.`, "success");
    } else {
      addProject({
        ...siteForm,
        code: siteForm.code || `SITE-${projects.length + 1}`,
      });
      setIsSiteModalOpen(false);
      showToast(`✓ New Project Site "${siteForm.name}" created successfully.`, "success");
    }

    setSiteForm(initialSiteForm);
  };

  // Submit Group Form (Create or Edit)
  const handleSaveGroup = (e) => {
    e.preventDefault();
    if (!groupForm.name.trim()) {
      showToast("Please enter team squad name", "error");
      return;
    }

    if (editingGroup) {
      updateGroup(editingGroup.id, {
        ...groupForm,
      });
      setEditingGroup(null);
      showToast(`✓ Team "${groupForm.name}" updated successfully.`, "success");
    } else {
      addGroup({
        ...groupForm,
      });
      setIsGroupModalOpen(false);
      showToast(`✓ New Trade Squad "${groupForm.name}" created successfully.`, "success");
    }

    setGroupForm(initialGroupForm);
  };

  // Delete Site Action
  const handleDeleteSiteConfirm = () => {
    if (deleteConfirmSite) {
      deleteProject(deleteConfirmSite.id);
      showToast(`✓ Site "${deleteConfirmSite.name}" deleted successfully.`, "success");
      setDeleteConfirmSite(null);
    }
  };

  // Delete Group Action
  const handleDeleteGroupConfirm = () => {
    if (deleteConfirmGroup) {
      deleteGroup(deleteConfirmGroup.id);
      showToast(`✓ Team "${deleteConfirmGroup.name}" deleted successfully.`, "success");
      setDeleteConfirmGroup(null);
    }
  };

  // Filtered Lists
  const filteredProjects = projects.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.locationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(
    (g) =>
      g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Header Panel */}
      <div className="app-panel p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            Site Infrastructure & Teams
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Sites & Trade Squads
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure active construction project locations, client details, and specialized trade teams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingSite(null);
              setSiteForm(initialSiteForm);
              setIsSiteModalOpen(true);
            }}
            className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md btn-touch transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Site / Project</span>
          </button>

          <button
            onClick={() => {
              setEditingGroup(null);
              setGroupForm({
                name: "",
                projectId: projects[0]?.id || "",
                description: "",
              });
              setIsGroupModalOpen(true);
            }}
            className="px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-2 btn-touch transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Add Team</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="app-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Tab Switcher: Project Sites vs Trade Squads */}
        <div className="grid grid-cols-2 max-w-xs w-full sm:w-auto p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 text-xs font-bold border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("sites")}
            className={`py-2 px-3 rounded-xl transition-all ${
              activeTab === "sites"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            Project Sites ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`py-2 px-3 rounded-xl transition-all ${
              activeTab === "teams"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            Trade Squads ({groups.length})
          </button>
        </div>

        {/* Search & View Mode Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab === "sites" ? "sites, clients, codes..." : "teams, trades..."}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full app-input pl-9 pr-3 py-2 rounded-xl text-xs"
            />
          </div>

          {/* View Mode Toggle: Grid vs List */}
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
          1. SITES VIEW (GRID & LIST)
      ───────────────────────────────────────────────────────── */}
      {activeTab === "sites" && (
        filteredProjects.length === 0 ? (
          <div className="app-card p-12 rounded-3xl text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Project Sites Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first project site to start assigning labour and tracking attendance.
            </p>
            <button
              onClick={() => {
                setEditingSite(null);
                setSiteForm(initialSiteForm);
                setIsSiteModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Site / Project</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View for Sites */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((proj) => {
              const siteWorkers = employees.filter((e) => {
                const pIds = e.assignedProjectIds || (e.assignedProjectId ? [e.assignedProjectId] : []);
                return pIds.includes(proj.id);
              });
              const siteSquads = groups.filter((g) => g.projectId === proj.id);

              return (
                <div
                  key={proj.id}
                  className="app-card p-5 rounded-3xl space-y-4 hover:border-blue-500 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top: Icon, Code & Action Buttons */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-blue-200 dark:border-slate-700">
                          {proj.code}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditSite(proj)}
                          title="Edit Site"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-400 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmSite(proj)}
                          title="Delete Site"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{proj.name}</h3>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                        Client: {proj.clientName || "Primary Client"}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{proj.locationName}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>{siteWorkers.length} Assigned Labour</span>
                    <span>{siteSquads.length} Teams Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List / Table View for Sites */
          <div className="app-card rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Site Name & Code</th>
                    <th className="p-4">Client Name</th>
                    <th className="p-4">Location / Address</th>
                    <th className="p-4">Assigned Labour</th>
                    <th className="p-4">Trade Teams</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredProjects.map((proj) => {
                    const siteWorkers = employees.filter((e) => {
                      const pIds = e.assignedProjectIds || (e.assignedProjectId ? [e.assignedProjectId] : []);
                      return pIds.includes(proj.id);
                    });
                    const siteSquads = groups.filter((g) => g.projectId === proj.id);

                    return (
                      <tr key={proj.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="p-4">
                          <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{proj.name}</div>
                          <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                            {proj.code}
                          </span>
                        </td>

                        <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                          {proj.clientName || "Primary Client"}
                        </td>

                        <td className="p-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                          {proj.locationName}
                        </td>

                        <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                          {siteWorkers.length} Workers
                        </td>

                        <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                          {siteSquads.length} Squads
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditSite(proj)}
                              title="Edit Site"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-400 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmSite(proj)}
                              title="Delete Site"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-500 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        )
      )}

      {/* ─────────────────────────────────────────────────────────
          2. TEAMS / SQUADS VIEW (GRID & LIST)
      ───────────────────────────────────────────────────────── */}
      {activeTab === "teams" && (
        filteredGroups.length === 0 ? (
          <div className="app-card p-12 rounded-3xl text-center space-y-3">
            <Users className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Trade Squads Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create teams to organize specialized trades (Masonry, Electrical, Plumbing, Logistics).
            </p>
            <button
              onClick={() => {
                setEditingGroup(null);
                setGroupForm(initialGroupForm);
                setIsGroupModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Team</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View for Teams */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((grp) => {
              const proj = projects.find((p) => p.id === grp.projectId);
              const teamWorkers = employees.filter((e) => e.assignedGroupId === grp.id);

              return (
                <div
                  key={grp.id}
                  className="app-card p-5 rounded-3xl space-y-4 hover:border-blue-500 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top: Icon, Members & Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                          <Users className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                          {teamWorkers.length} Members
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditGroup(grp)}
                          title="Edit Team"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-400 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmGroup(grp)}
                          title="Delete Team"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{grp.name}</h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {grp.description || "Active site workforce squad"}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        {proj?.name || "All Sites"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Specialized Trade Squad</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">● Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List / Table View for Teams */
          <div className="app-card rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Squad / Team Name</th>
                    <th className="p-4">Assigned Project Site</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Team Members</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredGroups.map((grp) => {
                    const proj = projects.find((p) => p.id === grp.projectId);
                    const teamWorkers = employees.filter((e) => e.assignedGroupId === grp.id);

                    return (
                      <tr key={grp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          {grp.name}
                        </td>

                        <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                          {proj?.name || "All Sites"}
                        </td>

                        <td className="p-4 text-slate-500 max-w-[200px] truncate">
                          {grp.description || "Active squad"}
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-300">
                            {teamWorkers.length} Members
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditGroup(grp)}
                              title="Edit Team"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-400 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmGroup(grp)}
                              title="Delete Team"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-500 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        )
      )}

      {/* ─────────────────────────────────────────────────────────
          ADD / EDIT PROJECT SITE MODAL
      ───────────────────────────────────────────────────────── */}
      {(isSiteModalOpen || editingSite) && (
        <div className="modal-overlay">
          <div className="app-panel modal-dialog max-w-md shadow-2xl animate-in fade-in">
            {/* Modal Header */}
            <div className="modal-header p-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  {editingSite ? "Update Site" : "New Project Site"}
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {editingSite ? `Edit Site (${editingSite.name})` : "Add Project Site"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSiteModalOpen(false);
                  setEditingSite(null);
                }}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveSite} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="modal-body p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Site / Project Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Commercial Complex Site B"
                    value={siteForm.name}
                    onChange={(e) => setSiteForm({ ...siteForm, name: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Site Code (e.g. SITE-B)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SITE-B"
                    value={siteForm.code}
                    onChange={(e) => setSiteForm({ ...siteForm, code: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Global Tech Realty Ltd"
                    value={siteForm.clientName}
                    onChange={(e) => setSiteForm({ ...siteForm, clientName: e.target.value })}
                    className="w-full app-input p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Site Address / Location <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows="2"
                    required
                    placeholder="e.g. Plot 42, Metro Expressway, New Delhi"
                    value={siteForm.locationName}
                    onChange={(e) => setSiteForm({ ...siteForm, locationName: e.target.value })}
                    className="w-full app-input p-3 rounded-xl"
                  />
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="modal-footer p-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2.5 bg-slate-50 dark:bg-slate-900/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsSiteModalOpen(false);
                    setEditingSite(null);
                  }}
                  className="py-3 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 btn-touch cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md btn-touch cursor-pointer"
                >
                  {editingSite ? "Save Changes" : "Create Site"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          ADD / EDIT GROUP MODAL
      ───────────────────────────────────────────────────────── */}
      {(isGroupModalOpen || editingGroup) && (
        <div className="modal-overlay">
          <div className="app-panel modal-dialog max-w-md shadow-2xl animate-in fade-in">
            {/* Modal Header */}
            <div className="modal-header p-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  {editingGroup ? "Update Squad" : "New Team Squad"}
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {editingGroup ? `Edit Team (${editingGroup.name})` : "Add Group / Team"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsGroupModalOpen(false);
                  setEditingGroup(null);
                }}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveGroup} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="modal-body p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Group / Team Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plaster & Finishing Squad"
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Site / Project
                  </label>
                  <select
                    value={groupForm.projectId}
                    onChange={(e) => setGroupForm({ ...groupForm, projectId: e.target.value })}
                    className="w-full app-input p-3 rounded-xl font-semibold cursor-pointer"
                  >
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Specialists in exterior plastering"
                    value={groupForm.description}
                    onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                    className="w-full app-input p-3 rounded-xl"
                  />
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="modal-footer p-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2.5 bg-slate-50 dark:bg-slate-900/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsGroupModalOpen(false);
                    setEditingGroup(null);
                  }}
                  className="py-3 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 btn-touch cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md btn-touch cursor-pointer"
                >
                  {editingGroup ? "Save Changes" : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          DELETE SITE CONFIRMATION MODAL
      ───────────────────────────────────────────────────────── */}
      {deleteConfirmSite && (
        <div className="modal-overlay">
          <div className="app-panel rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in fade-in text-center my-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Delete Project Site?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete <strong>{deleteConfirmSite.name}</strong> ({deleteConfirmSite.code})?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmSite(null)}
                className="py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 btn-touch cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSiteConfirm}
                className="py-2.5 rounded-xl font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-md btn-touch cursor-pointer"
              >
                Delete Site
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          DELETE GROUP CONFIRMATION MODAL
      ───────────────────────────────────────────────────────── */}
      {deleteConfirmGroup && (
        <div className="modal-overlay">
          <div className="app-panel rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in fade-in text-center my-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Delete Trade Team?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete team <strong>{deleteConfirmGroup.name}</strong>?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmGroup(null)}
                className="py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 btn-touch cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteGroupConfirm}
                className="py-2.5 rounded-xl font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-md btn-touch cursor-pointer"
              >
                Delete Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
