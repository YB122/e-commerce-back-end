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

