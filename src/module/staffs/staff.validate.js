import joi from "joi";



export const addStaffValidate = joi.object({
  userId: joi.string().length(24).hex().required(),
  dailySalary: joi.number().integer().min(0).required(),
  joinDate: joi.date().required(),
  department: joi.string().required(),
});

export const updateStaffValidate = joi.object({
  userId: joi.string().length(24).hex().optional(),
  dailySalary: joi.number().integer().min(0).optional(),
  joinDate: joi.date().optional(),
  department: joi.string().optional(),
  monthlyReports: joi.object({
    month: joi.string().optional(),
    totalDaysWorked: joi.number().integer().min(0).optional(),
    totalDeductions: joi.number().integer().min(0).optional(),
    finalSalary: joi.number().integer().min(0).optional(),
    isPaid: joi.boolean().default(false).optional(),
    paidAt: joi.date().optional()
  }).optional()
});

export const addDeductionValidate = joi.object({
  amount: joi.number().positive().required(),
  reason: joi.string().min(3).max(200).required(),
  date: joi.date().required(),
  month: joi.string().pattern(/^\d{4}-\d{2}$/).required()
});

export const updateDeductionValidate = joi.object({
  amount: joi.number().positive().optional(),
  reason: joi.string().min(3).max(200).optional(),
  date: joi.date().optional(),
  month: joi.string().pattern(/^\d{4}-\d{2}$/).optional()
});

