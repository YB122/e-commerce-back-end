import mongoose from "mongoose";
const { Schema } = mongoose;

const staffSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    dailySalary: { type: Number, required: true },
    joinDate: { type: Date, required: true },
    department: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    monthlyReports: [{
      month: { type: String, required: true },
      totalDaysWorked: { type: Number, required: true },
      totalDeductions: { type: Number, required: true },
      finalSalary: { type: Number, required: true },
      isPaid: { type: Boolean, default: false },
      paidAt: { type: Date, required: false }
    }],
    attendance: [{
      date: { type: Date, required: true },
      checkInTime: { type: Date, required: false },
      checkOutTime: { type: Date, required: false },
      isLate: { type: Boolean, default: false },
      workingHours: { type: Number, default: 0 },
      status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' }
    }]
  },
  { timestamps: true }
);

export const staffModel = mongoose.model("staffs", staffSchema);