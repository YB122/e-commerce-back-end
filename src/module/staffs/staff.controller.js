import { Router } from "express";
import { validateInput } from "../../common/utils/validate.js";

import { auth } from "../../common/middleware/auth.js";

import { updateStaffValidate, addStaffValidate, addDeductionValidate, updateDeductionValidate } from "./staff.validate.js";
import {
  getAllStaffs,
  addStaff,
  getStaffDetails,
  updateStaff,
  softDeleteStaff,
  checkIn,
  checkOut,
  addDeduction,
  getStaffDeductions,
  updateDeduction,
  removeDeduction,
  getStaffMonthlySalary,
  markAsPaid,
  adjustSalary
} from "./staff.service.js";


const router = Router();

// Apis for admin

router.get("/admin", auth, getAllStaffs);
router.post(
  "/admin",
  auth,
  validateInput(addStaffValidate),
  addStaff
);
router.delete("/admin/:id", auth, softDeleteStaff);
router.get('/admin/:id', auth, getStaffDetails);
router.put('/admin/:id', auth, validateInput(updateStaffValidate), updateStaff);

// Apis for Staff

router.post('/check-in', auth, checkIn);
router.post('/check-out', auth, checkOut);

// Apis for admin - Deductions

router.post('/admin/:id/deductions', auth, validateInput(addDeductionValidate), addDeduction);
router.get('/admin/:id/deductions', auth, getStaffDeductions);
router.put('/admin/:id/deductions/:deductionId', auth, validateInput(updateDeductionValidate), updateDeduction);
router.delete('/admin/:id/deductions/:deductionId', auth, removeDeduction);

// Apis Monthly Salary

router.get('/admin/:id/salary/:month', auth, getStaffMonthlySalary);
router.patch('/admin/:id/salary/:month/pay', auth, markAsPaid);
router.put('/admin/:id/salary/:month/adjust', auth, adjustSalary);

export default router;
