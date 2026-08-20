import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { generateEmployeeCode, calculateAttendanceHours } from "../utils/calculations";

const AppContext = createContext();

export const DEFAULT_COMPANY = {
  name: "AdTech Prime Infrastructure",
  code: "SITE-INFRA",
  logo: "",
  contractorName: "Javed Contractor",
  contractorMobile: "+91 98765 43210",
  phone: "+91 98765 43210",
  contractorEmail: "admin@contractor.com",
  email: "admin@contractor.com",
  address: "Plot 42, Civil Hub, Dadar West, Mumbai, MH - 400028",
  gstNo: "27AAACA1234A1Z5",
  licenceNo: "LIC-CIVIL-MH-2026-9812",
  contractorCode: "LIC-CIVIL-MH-2026-9812",
  adminPin: "1234",
};

export const DEFAULT_PROJECTS = [
  {
    id: "proj-101",
    name: "Main Construction Site A",
    code: "SITE-A",
    locationName: "Plot 42, Metro Expressway Hub, New Delhi",
    latitude: 28.6139,
    longitude: 77.2090,
    allowedRadiusMeters: 500,
    clientName: "Metro Infra Corp",
    status: "active",
  },
  {
    id: "proj-102",
    name: "Commercial Complex Site B",
    code: "SITE-B",
    locationName: "Sector 62, Cyber City, Gurgaon",
    latitude: 28.4595,
    longitude: 77.0266,
    allowedRadiusMeters: 500,
    clientName: "Global Tech Realty",
    status: "active",
  },
];

export const DEFAULT_GROUPS = [
  {
    id: "grp-201",
    name: "Mason & Brickwork Squad",
    projectId: "proj-101",
    description: "Primary civil masonry and structural team.",
    leadEmployeeId: null,
  },
  {
    id: "grp-202",
    name: "Electrical & Wiring Team",
    projectId: "proj-101",
    description: "Conduit, cabling, and panel wiring specialists.",
    leadEmployeeId: null,
  },
  {
    id: "grp-203",
    name: "General Helper & Logistics Squad",
    projectId: "proj-102",
    description: "Site logistics, material transport, and auxiliary assistance.",
    leadEmployeeId: null,
  },
];

// Helper to read initial state from localStorage fallback
const getSavedState = (key, fallback) => {
  try {
    const raw = localStorage.getItem("app_state_v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed[key] !== undefined) {
        if (Array.isArray(fallback) && Array.isArray(parsed[key])) {
          return parsed[key].length > 0 ? parsed[key] : fallback;
        }
        if (!Array.isArray(fallback) && typeof parsed[key] === "object") {
          return { ...fallback, ...parsed[key] };
        }
        return parsed[key];
      }
    }
  } catch (e) {
    console.warn("Error reading localStorage:", e);
  }
  return fallback;
};

// Same-origin API calls proxied by Vite to Express locally, or Vercel serverless /api/*
const getApiBaseUrl = () => "/api";

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState("superadmin");
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  // Theme Management (Light: White & Blue, Dark: Slate & Blue)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "light";
  });

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [company, setCompany] = useState(() => getSavedState("company", DEFAULT_COMPANY));
  const [projects, setProjects] = useState(() => getSavedState("projects", DEFAULT_PROJECTS));
  const [groups, setGroups] = useState(() => getSavedState("groups", DEFAULT_GROUPS));
  const [employees, setEmployees] = useState(() => getSavedState("employees", []));
  const [attendance, setAttendance] = useState(() => getSavedState("attendance", []));
  const [expenses, setExpenses] = useState(() => getSavedState("expenses", [])); // Money transfers & expenses
  const [tasks, setTasks] = useState(() => getSavedState("tasks", []));
  const [dailyReports, setDailyReports] = useState(() => getSavedState("dailyReports", []));
  const [notifications, setNotifications] = useState(() => getSavedState("notifications", []));
  const [payments, setPayments] = useState(() => getSavedState("payments", []));

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", durationMs = 3500) => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
    const newToast = { id, message, type, timestamp: Date.now() };
    
    setToasts((prev) => [...prev, newToast]);

    if (durationMs > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, durationMs);
    }
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Store Ref to avoid stale-closure issues in push
  const storeRef = useRef({});
  storeRef.current = {
    company,
    projects,
    groups,
    employees,
    attendance,
    expenses,
    tasks,
    dailyReports,
    notifications,
    payments,
  };

  const lastPushTimestamp = useRef(0);

  // Push state to backend
  const pushStateToBackend = useCallback(async (overrides = {}) => {
    try {
      const payload = { ...storeRef.current, ...overrides };
      const res = await fetch(`${getApiBaseUrl()}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.timestamp) lastPushTimestamp.current = json.timestamp;
      }
    } catch (err) {
      console.warn("Backend push failed:", err);
    }
  }, []);

  // Pull state from backend
  const isSyncingRef = useRef(false);
  const pullStateFromBackend = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    try {
      const res = await fetch(`${getApiBaseUrl()}/sync`);
      if (!res.ok) {
        isSyncingRef.current = false;
        return;
      }
      const data = await res.json();
      if (!data) {
        isSyncingRef.current = false;
        return;
      }

      const backendTs = data._ts || 0;
      if (backendTs >= lastPushTimestamp.current) {
        if (data.company) setCompany(data.company);
        if (Array.isArray(data.projects) && data.projects.length > 0) setProjects(data.projects);
        if (Array.isArray(data.groups)) setGroups(data.groups);
        if (Array.isArray(data.employees)) {
          const defaultValDate = () => {
            const d = new Date();
            d.setFullYear(d.getFullYear() + 1);
            return d.toISOString().split("T")[0];
          };
          const mappedEmps = data.employees.map((e) => ({
            ...e,
            cardValidity: e.cardValidity || defaultValDate(),
          }));
          setEmployees(mappedEmps);
        }
        if (Array.isArray(data.attendance)) setAttendance(data.attendance);
        if (Array.isArray(data.expenses)) setExpenses(data.expenses);
        if (Array.isArray(data.tasks)) setTasks(data.tasks);
        if (Array.isArray(data.dailyReports)) setDailyReports(data.dailyReports);
        if (Array.isArray(data.notifications)) setNotifications(data.notifications);
        if (Array.isArray(data.payments)) setPayments(data.payments);

        // Also mirror backend state into localStorage
        try {
          localStorage.setItem("app_state_v1", JSON.stringify(data));
        } catch (e) {}
      }
    } catch (err) {
      console.warn("Backend pull failed:", err);
    }
    isSyncingRef.current = false;
  }, []);

  useEffect(() => {
    pullStateFromBackend();
    const interval = setInterval(pullStateFromBackend, 2500);
    return () => clearInterval(interval);
  }, [pullStateFromBackend]);

  const commitAndPush = useCallback(
    (updatedFields) => {
      const payload = { ...storeRef.current, ...updatedFields };
      try {
        localStorage.setItem("app_state_v1", JSON.stringify(payload));
      } catch (e) {
        console.warn("localStorage save failed:", e);
      }
      pushStateToBackend(payload);
    },
    [pushStateToBackend]
  );

  // Clear all data
  const clearAllData = async () => {
    try {
      localStorage.removeItem("app_state_v1");
    } catch (e) {}
    try {
      await fetch(`${getApiBaseUrl()}/clear`, { method: "POST" });
    } catch (e) {
      console.warn(e);
    }
    setCompany(DEFAULT_COMPANY);
    setProjects(DEFAULT_PROJECTS);
    setGroups(DEFAULT_GROUPS);
    setEmployees([]);
    setAttendance([]);
    setExpenses([]);
    setTasks([]);
    setDailyReports([]);
    setNotifications([]);
    setPayments([]);
    setCurrentRole("superadmin");
    setCurrentEmployeeId(null);
  };

  // Active employee resolution
  const activeEmployee = employees.find((e) => e.id === currentEmployeeId) || employees[0] || null;

  // ─────────────────────────────────────────────────────────────
  // 1. EMPLOYEE ENROLLMENT & MANAGEMENT
  // ─────────────────────────────────────────────────────────────
  const addEmployee = (newEmpData) => {
    const existingCodes = employees.map((e) => e.employeeCode);
    const generatedCode = generateEmployeeCode(existingCodes);

    const newEmp = {
      id: `emp-${Date.now()}`,
      employeeCode: generatedCode,
      companyCode: company.code,
      joiningDate: new Date().toISOString().split("T")[0],
      status: "active",
      avatar: newEmpData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmpData.name || "Worker")}&background=1d4ed8&color=ffffff&size=200&bold=true`,
      // Expanded Enrollment Fields:
      name: newEmpData.name || "",
      mobile: newEmpData.mobile || "",
      alternateMobile: newEmpData.alternateMobile || "",
      govtIdType: newEmpData.govtIdType || "Aadhaar Card", // 'Aadhaar Card' | 'Voter ID' | 'PAN Card' | 'Driving License'
      govtIdNumber: newEmpData.govtIdNumber || "",
      designation: newEmpData.designation || "General Worker",
      salary: Number(newEmpData.salary) || 600, // Daily Salary in INR
      assignedProjectIds: Array.isArray(newEmpData.assignedProjectIds) && newEmpData.assignedProjectIds.length > 0 
        ? newEmpData.assignedProjectIds 
        : [newEmpData.assignedProjectId || projects[0]?.id || ""],
      assignedProjectId: newEmpData.assignedProjectId || (newEmpData.assignedProjectIds?.[0]) || projects[0]?.id || "",
      assignedGroupId: newEmpData.assignedGroupId || groups[0]?.id || "",
      address: newEmpData.address || "",
      emergencyContact: newEmpData.emergencyContact || newEmpData.alternateMobile || "",
      cardValidity: newEmpData.cardValidity || (() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        return d.toISOString().split("T")[0];
      })(),
      ...newEmpData,
    };

    const nextEmployees = [newEmp, ...employees];
    const nextNotifs = [
      {
        id: `notif-${Date.now()}`,
        title: "New Employee Enrolled",
        message: `${newEmp.name} enrolled with Code EMP-${newEmp.employeeCode} (${newEmp.designation})`,
        type: "general",
        employeeId: newEmp.id,
        date: new Date().toLocaleString("en-IN"),
        isRead: false,
      },
      ...notifications,
    ];

    setEmployees(nextEmployees);
    setNotifications(nextNotifs);
    commitAndPush({ employees: nextEmployees, notifications: nextNotifs });

    return newEmp;
  };

  const updateEmployee = (empId, updatedData) => {
    const nextEmployees = employees.map((e) => (e.id === empId ? { ...e, ...updatedData } : e));
    setEmployees(nextEmployees);
    commitAndPush({ employees: nextEmployees });
  };

  const deleteEmployee = (empId) => {
    const nextEmployees = employees.filter((e) => e.id !== empId);
    setEmployees(nextEmployees);
    commitAndPush({ employees: nextEmployees });
  };

  const toggleEmployeeStatus = (empId) => {
    const nextEmployees = employees.map((e) =>
      e.id === empId ? { ...e, status: e.status === "active" ? "inactive" : "active" } : e
    );
    setEmployees(nextEmployees);
    commitAndPush({ employees: nextEmployees });
  };

  // ─────────────────────────────────────────────────────────────
  // 2. ATTENDANCE & LIVE PUNCH
  // ─────────────────────────────────────────────────────────────
  const punchIn = ({ employeeId, projectId, siteName, lat, lng, address, selfieUrl }) => {
    const today = new Date().toISOString().split("T")[0];
    const nowTimeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const now = new Date();
    const isLate = now.getHours() > 10 || (now.getHours() === 10 && now.getMinutes() > 10);

    const newRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      date: today,
      punchInTimestamp: Date.now(), // timestamp for live stopwatch calculations
      punchInTime: nowTimeStr,
      punchOutTime: null,
      punchOutTimestamp: null,
      projectId,
      siteName,
      punchInLat: lat,
      punchInLng: lng,
      punchInAddress: address,
      punchOutLat: null,
      punchOutLng: null,
      punchOutAddress: null,
      punchInSelfie: selfieUrl,
      punchOutSelfie: null,
      status: isLate ? "late" : "present",
      workingHours: 0,
      regularHours: 0,
      halfDayHours: 0,
      overtimeHours: 0,
      overtimeSeconds: 0,
      overtimePeriod1: false,
      overtimePeriod2: false,
      overtimeStatus: "none", // 'none' | 'pending' | 'approved' | 'rejected'
      payCancelled: false,
      payCancelReason: null,
    };

    const nextAtt = [newRecord, ...attendance];
    let nextNotifs = [...notifications];

    if (isLate) {
      const emp = employees.find((e) => e.id === employeeId);
      nextNotifs = [
        {
          id: `notif-${Date.now()}`,
          title: "Late Punch-In Alert",
          message: `${emp?.name || "Labour"} punched in late at ${nowTimeStr}`,
          type: "late_punch",
          employeeId,
          date: new Date().toLocaleString("en-IN"),
          isRead: false,
        },
        ...nextNotifs,
      ];
    }

    setAttendance(nextAtt);
    setNotifications(nextNotifs);
    commitAndPush({ attendance: nextAtt, notifications: nextNotifs });

    return newRecord;
  };

  const punchOut = ({ attendanceId, lat, lng, address, selfieUrl }) => {
    const nowTimeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const nowTimestamp = Date.now();
    let nextNotifs = [...notifications];

    const nextAtt = attendance.map((att) => {
      if (att.id !== attendanceId) return att;

      const calc = calculateAttendanceHours(att.punchInTime, nowTimeStr);
      const needsOtApproval = calc.overtimePeriod1 || calc.overtimePeriod2;

      // Calculate total seconds worked
      const startMs = att.punchInTimestamp || new Date(`${att.date} ${att.punchInTime}`).getTime();
      const totalSecondsWorked = Math.max(0, Math.floor((nowTimestamp - startMs) / 1000));
      const overtimeSeconds = Math.max(0, totalSecondsWorked - 8 * 3600); // Beyond 8 hours

      if (needsOtApproval) {
        const emp = employees.find((e) => e.id === att.employeeId);
        nextNotifs = [
          {
            id: `notif-${Date.now()}`,
            title: "Overtime Approval Required",
            message: `${emp?.name || "Labour"} completed duty and requested Overtime Approval.`,
            type: "overtime_alert",
            employeeId: att.employeeId,
            date: new Date().toLocaleString("en-IN"),
            isRead: false,
          },
          ...nextNotifs,
        ];
      }

      return {
        ...att,
        punchOutTime: nowTimeStr,
        punchOutTimestamp: nowTimestamp,
        punchOutLat: lat,
        punchOutLng: lng,
        punchOutAddress: address,
        punchOutSelfie: selfieUrl,
        workingHours: calc.workingHours,
        regularHours: calc.regularHours,
        halfDayHours: calc.halfDayHours,
        overtimeHours: calc.overtimeHours,
        overtimeSeconds: overtimeSeconds,
        overtimePeriod1: calc.overtimePeriod1,
        overtimePeriod2: calc.overtimePeriod2,
        overtimeStatus: needsOtApproval ? "pending" : "none",
      };
    });

    setAttendance(nextAtt);
    setNotifications(nextNotifs);
    commitAndPush({ attendance: nextAtt, notifications: nextNotifs });
  };

  const cancelDayPay = (attendanceId, reason) => {
    const nextAtt = attendance.map((att) =>
      att.id === attendanceId ? { ...att, payCancelled: true, payCancelReason: reason } : att
    );
    setAttendance(nextAtt);
    commitAndPush({ attendance: nextAtt });
  };

  const restoreDayPay = (attendanceId) => {
    const nextAtt = attendance.map((att) =>
      att.id === attendanceId ? { ...att, payCancelled: false, payCancelReason: null } : att
    );
    setAttendance(nextAtt);
    commitAndPush({ attendance: nextAtt });
  };

  // ─────────────────────────────────────────────────────────────
  // 3. OVERTIME APPROVALS
  // ─────────────────────────────────────────────────────────────
  const approveOvertime = (attendanceId) => {
    const nextAtt = attendance.map((att) =>
      att.id === attendanceId ? { ...att, overtimeStatus: "approved" } : att
    );
    setAttendance(nextAtt);
    commitAndPush({ attendance: nextAtt });
  };

  const rejectOvertime = (attendanceId) => {
    const nextAtt = attendance.map((att) =>
      att.id === attendanceId ? { ...att, overtimeStatus: "rejected" } : att
    );
    setAttendance(nextAtt);
    commitAndPush({ attendance: nextAtt });
  };

  // ─────────────────────────────────────────────────────────────
  // 4. MONEY TRANSFERS & SITE EXPENSES
  // ─────────────────────────────────────────────────────────────
  const addMoneyTransfer = (transferData) => {
    const newRecord = {
      id: `trx-${Date.now()}`,
      date: transferData.date || new Date().toISOString().split("T")[0],
      amount: Number(transferData.amount) || 0,
      purpose: transferData.purpose || "Transfer",
      senderName: transferData.senderName || company.contractorName,
      transferType: transferData.transferType || "private_advance", // 'private_advance' | 'official_expense'
      paymentMode: transferData.paymentMode || "Cash", // 'Cash' | 'UPI / Bank' | 'Cheque'
      projectId: transferData.projectId || null,
      groupId: transferData.groupId || null,
      employeeId: transferData.employeeId || null,
      receiptUrl: transferData.receiptUrl || null,
      status: "approved",
      notes: transferData.notes || "",
    };

    const nextExpenses = [newRecord, ...expenses];
    let nextNotifs = [...notifications];

    if (newRecord.transferType === "private_advance" && newRecord.employeeId) {
      const emp = employees.find((e) => e.id === newRecord.employeeId);
      nextNotifs = [
        {
          id: `notif-${Date.now()}`,
          title: "Cash Advance Handover",
          message: `Transferred ₹${newRecord.amount} private cash advance to ${emp?.name || "Worker"} (Debited from salary).`,
          type: "money_transfer",
          employeeId: newRecord.employeeId,
          date: new Date().toLocaleString("en-IN"),
          isRead: false,
        },
        ...nextNotifs,
      ];
    }

    setExpenses(nextExpenses);
    setNotifications(nextNotifs);
    commitAndPush({ expenses: nextExpenses, notifications: nextNotifs });

    return newRecord;
  };

  const deleteMoneyTransfer = (expenseId) => {
    const nextExpenses = expenses.filter((item) => item.id !== expenseId);
    setExpenses(nextExpenses);
    commitAndPush({ expenses: nextExpenses });
  };

  const submitExpenseOrAdvance = (data) => {
    return addMoneyTransfer(data);
  };

  const updateExpenseStatus = (expenseId, newStatus) => {
    const nextExpenses = expenses.map((item) =>
      item.id === expenseId ? { ...item, status: newStatus } : item
    );
    setExpenses(nextExpenses);
    commitAndPush({ expenses: nextExpenses });
  };

  // ─────────────────────────────────────────────────────────────
  // 5. SITES / PROJECTS & SQUADS / GROUPS
  // ─────────────────────────────────────────────────────────────
  const addProject = (projData) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      code: `SITE-${projects.length + 1}`,
      status: "active",
      latitude: projData.latitude || 28.6139,
      longitude: projData.longitude || 77.2090,
      allowedRadiusMeters: projData.allowedRadiusMeters || 500,
      ...projData,
    };
    const nextProjects = [newProj, ...projects];
    setProjects(nextProjects);
    commitAndPush({ projects: nextProjects });
    return newProj;
  };

  const updateProject = (projId, updatedData) => {
    const nextProjects = projects.map((p) => (p.id === projId ? { ...p, ...updatedData } : p));
    setProjects(nextProjects);
    commitAndPush({ projects: nextProjects });
  };

  const deleteProject = (projId) => {
    const nextProjects = projects.filter((p) => p.id !== projId);
    setProjects(nextProjects);
    commitAndPush({ projects: nextProjects });
  };

  const addGroup = (groupData) => {
    const newGroup = {
      id: `grp-${Date.now()}`,
      projectId: groupData.projectId || projects[0]?.id,
      ...groupData,
    };
    const nextGroups = [newGroup, ...groups];
    setGroups(nextGroups);
    commitAndPush({ groups: nextGroups });
    return newGroup;
  };

  const updateGroup = (groupId, updatedData) => {
    const nextGroups = groups.map((g) => (g.id === groupId ? { ...g, ...updatedData } : g));
    setGroups(nextGroups);
    commitAndPush({ groups: nextGroups });
  };

  const deleteGroup = (groupId) => {
    const nextGroups = groups.filter((g) => g.id !== groupId);
    setGroups(nextGroups);
    commitAndPush({ groups: nextGroups });
  };

  // ─────────────────────────────────────────────────────────────
  // 6. TASKS & REPORTS
  // ─────────────────────────────────────────────────────────────
  const addTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      assignedBy: company.contractorName,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      ...taskData,
    };
    const nextTasks = [newTask, ...tasks];
    setTasks(nextTasks);
    commitAndPush({ tasks: nextTasks });
  };

  const updateTaskStatus = (taskId, status, notes = "", photo = null) => {
    const nextTasks = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status,
            progressNotes: notes || t.progressNotes,
            completionPhoto: photo || t.completionPhoto,
            completedAt: status === "completed" ? new Date().toLocaleString("en-IN") : t.completedAt,
          }
        : t
    );
    setTasks(nextTasks);
    commitAndPush({ tasks: nextTasks });
  };

  const submitDailyReport = (reportData) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "submitted",
      remarks: "Awaiting Superadmin review",
      ...reportData,
    };

    const nextReports = [newReport, ...dailyReports];
    const emp = employees.find((e) => e.id === reportData.employeeId);
    const nextNotifs = [
      {
        id: `notif-${Date.now()}`,
        title: "Daily Work Report Submitted",
        message: `${emp?.name || "Labour"} submitted daily work report for review.`,
        type: "daily_report_submitted",
        employeeId: reportData.employeeId,
        date: new Date().toLocaleString("en-IN"),
        isRead: false,
      },
      ...notifications,
    ];

    setDailyReports(nextReports);
    setNotifications(nextNotifs);
    commitAndPush({ dailyReports: nextReports, notifications: nextNotifs });

    return newReport;
  };

  const reviewDailyReport = (reportId, remarks) => {
    const nextReports = dailyReports.map((r) =>
      r.id === reportId ? { ...r, status: "reviewed", remarks } : r
    );
    setDailyReports(nextReports);
    commitAndPush({ dailyReports: nextReports });
  };

  // ─────────────────────────────────────────────────────────────
  // 7. PAYMENTS & NOTIFICATIONS
  // ─────────────────────────────────────────────────────────────
  const recordPayment = (paymentData) => {
    const newPayment = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      ...paymentData,
    };
    const nextPayments = [newPayment, ...payments];
    setPayments(nextPayments);
    commitAndPush({ payments: nextPayments });
  };

  const addNotification = (notifData) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      date: new Date().toLocaleString("en-IN"),
      isRead: false,
      ...notifData,
    };
    const nextNotifs = [newNotif, ...notifications];
    setNotifications(nextNotifs);
    commitAndPush({ notifications: nextNotifs });
  };

  const markNotificationRead = (notifId) => {
    const nextNotifs = notifications.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
    setNotifications(nextNotifs);
    commitAndPush({ notifications: nextNotifs });
  };

  const markAllNotificationsRead = () => {
    const nextNotifs = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(nextNotifs);
    commitAndPush({ notifications: nextNotifs });
  };

  // ─────────────────────────────────────────────────────────────
  // 8. ORGANIZATION PROFILE & PIN SECURITY
  // ─────────────────────────────────────────────────────────────
  const updateCompanyProfile = (updatedData) => {
    const nextCompany = { ...company, ...updatedData };
    setCompany(nextCompany);
    commitAndPush({ company: nextCompany });
    return nextCompany;
  };

  const updateAdminPin = (newPin) => {
    const cleanPin = String(newPin).trim();
    const nextCompany = { ...company, adminPin: cleanPin };
    setCompany(nextCompany);
    commitAndPush({ company: nextCompany });
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        // Theme
        theme,
        toggleTheme,
        // Role & Active State
        currentRole,
        setCurrentRole,
        currentEmployeeId,
        setCurrentEmployeeId,
        activeEmployee,
        // Core Entities
        company,
        setCompany,
        updateCompanyProfile,
        updateAdminPin,
        projects,
        groups,
        employees,
        attendance,
        expenses,
        tasks,
        dailyReports,
        notifications,
        payments,
        // Database Controls
        clearAllData,
        resetDemoData: clearAllData,
        // Employee Actions
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
        // Attendance & Live Punch
        punchIn,
        punchOut,
        cancelDayPay,
        restoreDayPay,
        // Overtime Actions
        approveOvertime,
        rejectOvertime,
        // Money Transfers & Expenses
        addMoneyTransfer,
        deleteMoneyTransfer,
        deleteExpense: deleteMoneyTransfer,
        submitExpenseOrAdvance,
        updateExpenseStatus,
        // Project & Team Actions
        addProject,
        updateProject,
        deleteProject,
        addGroup,
        updateGroup,
        deleteGroup,
        // Task & Report Actions
        addTask,
        updateTaskStatus,
        submitDailyReport,
        reviewDailyReport,
        // Payment Actions
        recordPayment,
        // Notifications
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        // Toast Notifications
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
