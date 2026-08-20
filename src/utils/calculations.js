/**
 * Calculation Utilities for Attendance, Overtime, and Salary Book
 */

/**
 * Calculates working hours, regular hours, half-day hours, and overtime periods
 * based on Punch-In and Punch-Out time strings (HH:mm format or 12h format).
 */
export function calculateAttendanceHours(punchInTimeStr, punchOutTimeStr) {
  if (!punchInTimeStr || !punchOutTimeStr) {
    return {
      workingHours: 0,
      regularHours: 0,
      halfDayHours: 0,
      overtimeHours: 0,
      overtimePeriod1: false,
      overtimePeriod2: false,
      isHalfDay: false,
      isLate: false,
    };
  }

  const parseTime = (timeStr) => {
    // Converts "09:52 AM" or "18:30" to minutes from midnight
    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    } else {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    }
  };

  const inMins = parseTime(punchInTimeStr);
  const outMins = parseTime(punchOutTimeStr);

  const durationMins = Math.max(0, outMins - inMins);
  const workingHours = parseFloat((durationMins / 60).toFixed(2));

  // Schedule thresholds in minutes from midnight
  const standardInMins = 10 * 60; // 10:00 AM (600 mins)
  const halfDayOutMins = 14 * 60; // 02:00 PM (840 mins)
  const regularOutMins = 18 * 60; // 06:00 PM (1080 mins)
  const bufferOutMins = 18 * 60 + 30; // 06:30 PM (1110 mins)
  const ot1EndMins = 21 * 60; // 09:00 PM (1260 mins)
  const ot2EndMins = 23 * 60; // 11:00 PM (1380 mins)

  const isLate = inMins > standardInMins + 10; // 10-minute grace period
  const isHalfDay = durationMins < 5 * 60 || (outMins <= halfDayOutMins + 15);

  let overtimePeriod1 = false;
  let overtimePeriod2 = false;
  let overtimeHours = 0;

  if (outMins > bufferOutMins) {
    overtimePeriod1 = true;
    const ot1Minutes = Math.min(outMins, ot1EndMins) - bufferOutMins;
    overtimeHours += Math.max(0, ot1Minutes / 60);
  }

  if (outMins > ot1EndMins) {
    overtimePeriod2 = true;
    const ot2Minutes = Math.min(outMins, ot2EndMins) - ot1EndMins;
    overtimeHours += Math.max(0, ot2Minutes / 60);
  }

  overtimeHours = parseFloat(overtimeHours.toFixed(2));
  const regularHours = parseFloat(Math.min(workingHours, 8.0).toFixed(2));

  return {
    workingHours,
    regularHours,
    halfDayHours: isHalfDay ? workingHours : 0,
    overtimeHours,
    overtimePeriod1,
    overtimePeriod2,
    isHalfDay,
    isLate,
  };
}

/**
 * Calculates complete Salary Book ledger for an employee over a month / date range.
 */
export function calculateEmployeeSalaryLedger(employee, attendanceList, expensesList, paymentsList = []) {
  const dailyRate = Number(employee.salary || employee.dailySalary || 600);
  const halfDayRate = dailyRate / 2;

  let presentDaysCount = 0;
  let halfDaysCount = 0;
  let absentDaysCount = 0;
  let approvedOtPeriod1Count = 0;
  let approvedOtPeriod2Count = 0;
  let payCancelledDaysCount = 0;
  let baseEarnings = 0;
  let otEarnings = 0;

  attendanceList.forEach((att) => {
    if (att.payCancelled) {
      payCancelledDaysCount++;
      return; // Skip salary calculation for pay cancelled days
    }

    if (att.status === "present" || att.status === "late") {
      presentDaysCount++;
      baseEarnings += dailyRate;
    } else if (att.status === "half_day") {
      halfDaysCount++;
      baseEarnings += halfDayRate;
    } else if (att.status === "absent") {
      absentDaysCount++;
    }

    // Overtime calculation: Period 1 = +50% daily rate bonus, Period 2 = +50% daily rate bonus
    if (att.overtimeStatus === "approved") {
      if (att.overtimePeriod1) {
        approvedOtPeriod1Count++;
        otEarnings += halfDayRate;
      }
      if (att.overtimePeriod2) {
        approvedOtPeriod2Count++;
        otEarnings += halfDayRate;
      }
      if (!att.overtimePeriod1 && !att.overtimePeriod2 && (att.overtimeHours > 0 || att.overtimeSeconds > 0)) {
        approvedOtPeriod1Count++;
        otEarnings += halfDayRate;
      }
    }
  });

  // Calculate Advances and Reimbursed Expenses
  let personalAdvancesTotal = 0;
  let officialExpensesReimbursedTotal = 0;

  expensesList.forEach((item) => {
    const isApproved = !item.status || item.status === "approved" || item.status === "disbursed";
    if (isApproved) {
      const isAdvance =
        item.transferType === "private_advance" ||
        item.type === "advance" ||
        item.classification === "personal";

      const isExpense =
        item.transferType === "official_expense" ||
        (item.type === "expense" && item.classification === "official");

      if (isAdvance) {
        personalAdvancesTotal += Number(item.amount || 0);
      } else if (isExpense) {
        officialExpensesReimbursedTotal += Number(item.amount || 0);
      }
    }
  });

  // Calculate direct payments already paid to worker
  let totalPaidOut = 0;
  if (paymentsList && Array.isArray(paymentsList)) {
    paymentsList.forEach((p) => {
      totalPaidOut += Number(p.amount || 0);
    });
  }

  const grossEarned = baseEarnings + otEarnings;
  const netPayable = Math.max(0, grossEarned - personalAdvancesTotal - totalPaidOut);

  return {
    employeeId: employee.id,
    dailyRate,
    halfDayRate,
    presentDaysCount,
    halfDaysCount,
    absentDaysCount,
    payCancelledDaysCount,
    workedDays: presentDaysCount + halfDaysCount,
    approvedOtPeriods: approvedOtPeriod1Count + approvedOtPeriod2Count,
    approvedOtPeriod1Count,
    approvedOtPeriod2Count,
    baseEarnings,
    baseSalary: baseEarnings,
    otEarnings,
    otBonus: otEarnings,
    officialExpensesReimbursedTotal,
    personalAdvancesTotal,
    totalAdvances: personalAdvancesTotal,
    totalPaidOut,
    grossEarned,
    netPayable,
  };
}

/**
 * Calculates distance between two GPS coordinates in meters (Haversine formula).
 */
export function calculateGpsDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Generates a random 4-digit Employee Code (1000 - 9999) guaranteed unique.
 */
export function generateEmployeeCode(existingCodes = []) {
  let code = "";
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (existingCodes.includes(code));
  return code;
}
