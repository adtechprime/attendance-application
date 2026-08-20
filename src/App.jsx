import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";
import { MobileNav } from "./components/common/MobileNav";
import { NotificationCenter } from "./components/common/NotificationCenter";
import { AuthScreen } from "./components/common/AuthScreen";
import { ToastContainer } from "./components/common/ToastContainer";

// Superadmin Components
import { SuperadminDashboard } from "./components/superadmin/SuperadminDashboard";
import { EmployeeManagement } from "./components/superadmin/EmployeeManagement";
import { EmployeeProfile360 } from "./components/superadmin/EmployeeProfile360";
import { AttendanceMonitor } from "./components/superadmin/AttendanceMonitor";
import { OvertimeApprovals } from "./components/superadmin/OvertimeApprovals";
import { SalaryBook } from "./components/superadmin/SalaryBook";
import { AdvanceExpenseManager } from "./components/superadmin/AdvanceExpenseManager";
import { ProjectsAndGroups } from "./components/superadmin/ProjectsAndGroups";
import { OrganizationProfile } from "./components/superadmin/OrganizationProfile";

// Labour Components
import { PunchStation } from "./components/labour/PunchStation";
import { LabourAttendanceCalendar } from "./components/labour/LabourAttendanceCalendar";
import { LabourMoneyTransfers } from "./components/labour/LabourMoneyTransfers";
import { LabourOvertimeView } from "./components/labour/LabourOvertimeView";
import { LabourIDCard } from "./components/labour/LabourIDCard";

const MainContent = () => {
  const { currentRole } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState(
    currentRole === "superadmin" ? "dashboard" : "labour_punch"
  );
  const [selectedEmp360Id, setSelectedEmp360Id] = useState(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Sync default tab when role changes
  useEffect(() => {
    if (currentRole === "superadmin") {
      if (activeTab.startsWith("labour_")) setActiveTab("dashboard");
    } else {
      if (!activeTab.startsWith("labour_")) setActiveTab("labour_punch");
    }
  }, [currentRole]);

  const handleSelectEmployee360 = (empId) => {
    setSelectedEmp360Id(empId);
    setActiveTab("profile_360");
  };

  if (!isAuthenticated) {
    return (
      <AuthScreen
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setActiveTab(currentRole === "superadmin" ? "dashboard" : "labour_punch");
        }}
      />
    );
  }

  const renderTabContent = () => {
    // 360 View override for Superadmin
    if (activeTab === "profile_360" && selectedEmp360Id && currentRole === "superadmin") {
      return (
        <EmployeeProfile360
          employeeId={selectedEmp360Id}
          onBack={() => setActiveTab("employees")}
        />
      );
    }

    // Superadmin Tabs
    if (currentRole === "superadmin") {
      switch (activeTab) {
        case "dashboard":
          return (
            <SuperadminDashboard
              onNavigateTab={setActiveTab}
              onSelectEmployeeProfile={handleSelectEmployee360}
            />
          );
        case "employees":
          return <EmployeeManagement onSelectEmployeeProfile={handleSelectEmployee360} />;
        case "attendance":
          return <AttendanceMonitor />;
        case "overtime":
          return <OvertimeApprovals />;
        case "expenses":
          return <AdvanceExpenseManager />;
        case "projects":
          return <ProjectsAndGroups />;
        case "salary":
          return <SalaryBook onSelectEmployeeProfile={handleSelectEmployee360} />;
        case "profile":
          return <OrganizationProfile />;
        default:
          return (
            <SuperadminDashboard
              onNavigateTab={setActiveTab}
              onSelectEmployeeProfile={handleSelectEmployee360}
            />
          );
      }
    }

    // Labour / Employee Tabs
    switch (activeTab) {
      case "labour_punch":
        return <PunchStation />;
      case "labour_attendance":
        return <LabourAttendanceCalendar />;
      case "labour_transfers":
        return <LabourMoneyTransfers />;
      case "labour_overtime":
        return <LabourOvertimeView />;
      case "labour_idcard":
        return <LabourIDCard />;
      default:
        return <PunchStation />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Global In-App Toast Hub */}
      <ToastContainer />

      {/* Top Header */}
      <Header
        onToggleNotifications={() => setIsNotifOpen(true)}
        onLogout={() => setIsAuthenticated(false)}
        onNavigateTab={setActiveTab}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Viewport Content with Mobile Bottom Padding */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
          {renderTabContent()}
        </main>
      </div>

      {/* Android Mobile Touch Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Slide-over Notifications Panel */}
      <NotificationCenter
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
