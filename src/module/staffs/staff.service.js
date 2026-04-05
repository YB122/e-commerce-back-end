import { staffModel } from "../../database/model/staff.model";
import { deductionModel } from "../../database/model/deduction.model";

export const getAllStaffs = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    const allStaffs = await staffModel.find();
    if (allStaffs.length) {
      res.status(200).json({ message: "success", allStaffs });
    } else {
      res.status(404).json({ message: "No staffs found" });
    }
  }
  else {
    res.status(401).json({ message: "for admin only" });
  }
};

export const addStaff = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    let { userId, dailySalary, joinDate, department } = req.body;
    let staffFound = await staffModel.findOne({ userId });
    if (staffFound) {
      return res.status(400).json({ message: "Staff already exists" });
    }
    let newStaff = await staffModel.insertMany({ userId, dailySalary, joinDate, department });
    if (newStaff) {
      res.status(200).json({ message: "success", newStaff });
    }
    else {
      res.status(400).json({ message: "staff not added" });
    }
  }
  else {
    res.status(401).json({ message: "for admin only" });
  }

};

export const getStaffDetails = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    let { id } = req.params;
    const staff = await staffModel.findById(id);
    if (staff) {
      res.status(200).json({ message: "success", staff });
    } else {
      res.status(404).json({ message: "Staff not found" });
    }
  }
  else {
    res.status(401).json({ message: "for admin only" });
  }
};

export const updateStaff = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    try {
      const { id } = req.params;
      const { userId, dailySalary, joinDate, department, monthlyReports } = req.body;

      // Check if staff exists
      const existingStaff = await staffModel.findById(id);
      if (!existingStaff) {
        return res.status(404).json({ message: "Staff not found" });
      }

      // Handle monthlyReports updates
      if (monthlyReports) {
        const report = monthlyReports;
        const existingReportIndex = existingStaff.monthlyReports.findIndex(
          r => r.month == report.month
        );

        if (existingReportIndex != -1) {
          // Update existing month report
          existingStaff.monthlyReports[existingReportIndex] = {
            ...existingStaff.monthlyReports[existingReportIndex],
            ...report
          };
        } else {
          // Add new month report
          existingStaff.monthlyReports.push(report);
        }
      }

      // Update basic staff fields
      const updateFields = {};
      if (userId) updateFields.userId = userId;
      if (dailySalary) updateFields.dailySalary = dailySalary;
      if (joinDate) updateFields.joinDate = joinDate;
      if (department) updateFields.department = department;

      const updatedStaff = await staffModel.findByIdAndUpdate(
        id,
        {
          $set: updateFields,
          monthlyReports: existingStaff.monthlyReports
        },
        { new: true }
      );
      if (updatedStaff) {
        res.status(200).json({ message: "success", updatedStaff });
      } else {
        res.status(400).json({ message: "Update failed" });
      }
    } catch (error) {
      res.status(400).json({ message: "Update failed", error: error.message });
    }
  }
  else {
    res.status(401).json({ message: "for admin only" });
  }
};

export const softDeleteStaff = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    let { id } = req.params;
    const staff = await staffModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (staff) {
      res.status(200).json({ message: "success", staff });
    } else {
      res.status(404).json({ message: "Staff not found" });
    }
  }
  else {
    res.status(401).json({ message: "for admin only" });
  }
};

export const checkIn = async (req, res) => {
  if (req.user && req.bearer == 'staff') {

    const staff = await staffModel.findOne({ userId: req.user.id });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found in staff table" });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const existingAttendance = staff.attendance.find(
      record => new Date(record.date).toDateString() == today.toDateString()
    );

    if (existingAttendance?.checkInTime) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const checkInTime = new Date();
    const isLate = checkInTime.getHours() > 9 || (checkInTime.getHours() == 9 && checkInTime.getMinutes() > 0);

    if (existingAttendance) {
      existingAttendance.checkInTime = checkInTime;
      existingAttendance.isLate = isLate;
      existingAttendance.status = isLate ? 'late' : 'present';
    } else {
      staff.attendance.push({
        date: today,
        checkInTime: checkInTime,
        isLate: isLate,
        status: isLate ? 'late' : 'present'
      });
    }

    try {
      await staff.save();
      res.status(200).json({
        message: "Check-in successful",
        checkInTime: checkInTime,
        isLate: isLate
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to save attendance", error: error.message });
    }

  } else {
    res.status(400).json({ message: "for staff only" });
  }
};

export const checkOut = async (req, res) => {
  if (req.user && req.bearer == 'staff') {

    const userId = req.user.id;

    const staff = await staffModel.findOne({ userId });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found in staff table" });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const existingAttendance = staff.attendance.find(
      record => new Date(record.date).toDateString() == today.toDateString()
    );

    if (!existingAttendance?.checkInTime) {
      return res.status(400).json({ message: "No check-in record found for today" });
    }

    if (existingAttendance.checkOutTime) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(existingAttendance.checkInTime);
    const workingHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

    existingAttendance.checkOutTime = checkOutTime;
    existingAttendance.workingHours = Math.round(workingHours * 100) / 100;

    if (workingHours < 8) {
      const hoursShort = 8 - workingHours;
      const deductionAmount = (hoursShort / 8) * staff.dailySalary;
      try {
        await deductionModel.insertMany({
          staff: staff._id,
          month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
          amount: Math.round(deductionAmount * 100) / 100,
          reason: `Short working hours: ${Math.round(workingHours * 100) / 100} hours`,
          date: now
        });

      } catch (error) {
        return res.status(400).json({ message: "Error creating deduction", error: error.message });
      }

    }
    try {
      await staff.save();
      return res.status(200).json({
        message: "Check-out successful",
        checkOutTime: checkOutTime,
        workingHours: existingAttendance.workingHours
      });
    } catch (error) {
      return res.status(400).json({ message: "Error saving staff", error: error.message });
    }
  } else {
    return res.status(400).json({ message: "for staff only" });
  }
};

export const addDeduction = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    let { id } = req.params;
    let staffFound = await staffModel.findById(id);
    if (!staffFound) {
      return res.status(404).json({ message: "Staff not found" });
    }
    let { amount, reason } = req.body;
    if (!amount || !reason) {
      return res.status(400).json({ message: "Amount and reason are required" });
    }

    const now = new Date();
    let deduction = await deductionModel.insertMany({
      staff: id,
      amount,
      reason,
      month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      date: now
    });
    if (deduction)
      return res.status(200).json({ message: "Deduction added successfully", data: deduction });
    else
      return res.status(400).json({ message: "Error adding deduction" });

  } else {
    res.status(401).json({ message: "for admin only" });
  }
};

export const getStaffDeductions = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    let { id } = req.params;
    let staffFound = await staffModel.findById(id);
    if (!staffFound) {
      return res.status(404).json({ message: "Staff not found" });
    }
    let deductions = await deductionModel.find({ staff: id });
    if (deductions.length == 0) {
      return res.status(404).json({ message: "No deductions found for this staff" });
    }
    return res.status(200).json({ message: "Staff deductions", data: deductions });
  } else {
    res.status(401).json({ message: "for admin only" });
  }
};

export const updateDeduction = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    let { id, deductionId } = req.params;
    let { amount, reason, date, month } = req.body;

    let staffFound = await staffModel.findById(id);
    if (!staffFound) {
      return res.status(404).json({ message: "Staff not found" });
    }

    let deductionFound = await deductionModel.findById(deductionId);
    if (!deductionFound) {
      return res.status(404).json({ message: "Deduction not found" });
    }

    if (deductionFound.staff != id) {
      return res.status(400).json({ message: "Deduction does not belong to this staff" });
    }
    if (!(amount && reason && date && month)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const updateFields = {};
      if (amount) updateFields.amount = amount;
      if (reason) updateFields.reason = reason;
      if (date) updateFields.date = date;
      if (month) updateFields.month = month;

      const updatedDeduction = await deductionModel.findByIdAndUpdate(
        deductionId,
        updateFields,
        { new: true }
      );

      return res.status(200).json({
        message: "Deduction updated successfully",
        data: updatedDeduction
      });
    } catch (error) {
      return res.status(400).json({
        message: "Error updating deduction",
        error: error.message
      });
    }
  } else {
    res.status(401).json({ message: "for admin only" });
  }
};

export const removeDeduction = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    let { id, deductionId } = req.params;
    let staffFound = await staffModel.findById(id);
    if (!staffFound) {
      return res.status(404).json({ message: "Staff not found" });
    }
    let deductionFound = await deductionModel.findById(deductionId);
    if (!deductionFound) {
      return res.status(404).json({ message: "Deduction not found" });
    }
    if (deductionFound.staff.toString() != id) {
      return res.status(400).json({ message: "Deduction does not belong to this staff" });
    }
    let deductionRemoved = await deductionModel.findByIdAndDelete(deductionId, { new: true });
    if (deductionRemoved) {
      res.status(200).json({ message: "success", data: deductionRemoved });
    }
    else {
      res.status(400).json({ message: "deduction not removed" });
    }
  } else {
    res.status(401).json({ message: "for admin only" });
  }
};



export const getStaffMonthlySalary = async (req, res) => {
  try {
    if (req.user && req.bearer == 'admin') {
      let { id } = req.params;
      let { month } = req.query;


      let staffFound = await staffModel.findById(id);
      if (!staffFound) {
        return res.status(404).json({ message: "Staff not found" });
      }


      if (!/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ message: "Invalid month format. Use YYYY-MM" });
      }


      if (!staffFound?.isActive) {
        return res.status(400).json({ message: "Staff is not active" });
      }

      const [year, monthNum] = month.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0);

      const monthAttendance = staffFound.attendance.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      });

      if (monthAttendance.length == 0) {
        return res.status(400).json({
          message: "Staff has no work/attendance records for this month",
          month: month
        });
      }


      const attendanceStats = monthAttendance.reduce((stats, record) => {
        if (record.status == 'present') stats.present++;
        else if (record.status == 'late') stats.late++;
        else if (record.status == 'absent') stats.absent++;
        return stats;
      }, { present: 0, late: 0, absent: 0 });


      let workingDaysInMonth = 0;
      for (let day = 1; day <= endDate.getDate(); day++) {
        const currentDate = new Date(year, monthNum - 1, day);
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek != 0 && dayOfWeek != 6) {
          workingDaysInMonth++;
        }
      }


      const manualDeductions = await deductionModel.find({
        staff: id,
        month: month
      });

      const totalManualDeductions = manualDeductions.reduce((sum, deduction) => sum + deduction.amount, 0);


      const dailySalary = staffFound.dailySalary;
      const baseSalary = dailySalary * workingDaysInMonth;

      const lateDeductions = attendanceStats.late * (dailySalary * 0.1);
      const absentDeductions = attendanceStats.absent * dailySalary;
      const totalDeductions = lateDeductions + absentDeductions + totalManualDeductions;

      const adjustments = 0;
      const finalSalary = baseSalary - totalDeductions + adjustments;


      const existingReportIndex = staffFound.monthlyReports.findIndex(report => report.month == month);

      if (existingReportIndex != -1) {

        staffFound.monthlyReports[existingReportIndex] = {
          month: month,
          totalDaysWorked: attendanceStats.present + attendanceStats.late,
          totalDeductions: totalDeductions,
          finalSalary: finalSalary,
          isPaid: staffFound.monthlyReports[existingReportIndex].isPaid || false,
          paidAt: staffFound.monthlyReports[existingReportIndex].paidAt || null,
          adjustments: staffFound.monthlyReports[existingReportIndex].adjustments || []
        };
      } else {

        const monthlyReport = {
          month: month,
          totalDaysWorked: attendanceStats.present + attendanceStats.late,
          totalDeductions: totalDeductions,
          finalSalary: finalSalary,
          isPaid: false,
          paidAt: null
        };
        staffFound.monthlyReports.push(monthlyReport);
      }


      let savedStaff = await staffFound.save();
      if (!savedStaff) {
        return res.status(500).json({ message: "Failed to save monthly report" });
      }


      const updatedReport = staffFound.monthlyReports.find(report => report.month == month);

      res.status(200).json({
        message: existingReportIndex != -1 ? "Monthly salary recalculated successfully" : "Monthly salary calculated successfully",
        data: updatedReport
      });

    } else {
      res.status(401).json({ message: "For admin only" });
    }
  } catch (error) {
    console.error("Error in getStaffMonthlySalary:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const markAsPaid = async (req, res) => {
  try {
    if (req.user && req.bearer == 'admin') {
      let { id } = req.params;
      let { month } = req.query;

      let staffFound = await staffModel.findById(id);
      if (!staffFound) {
        return res.status(404).json({ message: "Staff not found" });
      }

      if (!/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ message: "Invalid month format. Use YYYY-MM" });
      }

      const monthlyReport = staffFound.monthlyReports.find(report => report.month == month);
      if (!monthlyReport) {
        return res.status(404).json({
          message: "Monthly salary report not found for this month",
          month: month
        });
      }


      if (monthlyReport.isPaid) {
        return res.status(400).json({
          message: "Salary for this month is already marked as paid",
          month: month,
          paidAt: monthlyReport.paidAt
        });
      }

      monthlyReport.isPaid = true;

      monthlyReport.paidAt = new Date();


      const salarySlip = {
        month: month,
        totalDaysWorked: monthlyReport.totalDaysWorked,
        finalSalary: monthlyReport.finalSalary,
        totalDeductions: monthlyReport.totalDeductions,
        paidAt: monthlyReport.paidAt,
        paidBy: req.user._id
      };


      let savedStaff = await staffFound.save();
      if (!savedStaff) {
        return res.status(500).json({ message: "Failed to update payment status" });
      }

      res.status(200).json({
        message: "Salary marked as paid successfully",
        month: month,
        paidAt: monthlyReport.paidAt,
        finalSalary: monthlyReport.finalSalary,
        salarySlip: salarySlip
      });

    } else {
      res.status(401).json({ message: "For admin only" });
    }
  } catch (error) {
    console.error("Error in markAsPaid:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const adjustSalary = async (req, res) => {

  if (req.user && req.bearer == 'admin') {
    let { id, month } = req.params;
    let { adjustmentAmount, adjustmentReason } = req.body;


    let staffFound = await staffModel.findById(id);
    if (!staffFound) {
      return res.status(404).json({ message: "Staff not found" });
    }


    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Invalid month format. Use YYYY-MM" });
    }


    if (typeof adjustmentAmount != 'number' || Number.isNaN(adjustmentAmount)) {
      return res.status(400).json({ message: "Adjustment amount must be a valid number" });
    }

    if (!adjustmentReason || adjustmentReason.trim() == '') {
      return res.status(400).json({ message: "Adjustment reason is required" });
    }

    const monthlyReport = staffFound.monthlyReports.find(report => report.month == month);
    if (!monthlyReport) {
      return res.status(404).json({
        message: "Monthly salary report not found for this month",
        month: month
      });
    }


    if (monthlyReport.isPaid) {
      return res.status(400).json({
        message: "Cannot adjust salary for a month that is already marked as paid",
        month: month,
        paidAt: monthlyReport.paidAt
      });
    }

    const oldFinalSalary = monthlyReport.finalSalary;
    monthlyReport.finalSalary += adjustmentAmount;


    if (!monthlyReport.adjustments) {
      monthlyReport.adjustments = [];
    }
    monthlyReport.adjustments.push({
      staff: id,
      amount: adjustmentAmount,
      reason: adjustmentReason,
      date: new Date(),
      month: month
    });

    let savedStaff = await staffFound.save();
    if (!savedStaff) {
      return res.status(500).json({ message: "Failed to apply salary adjustment" });
    }

    res.status(200).json({
      message: "Salary adjusted successfully",
      month: month,
      oldFinalSalary: oldFinalSalary,
      newFinalSalary: monthlyReport.finalSalary,
      adjustment: { amount: adjustmentAmount, reason: adjustmentReason }
    });

  } else {
    res.status(401).json({ message: "For admin only" });
  }

};
