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