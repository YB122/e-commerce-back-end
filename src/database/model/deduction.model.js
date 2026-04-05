import mongoose from "mongoose";
const { Schema } = mongoose;

const deductionSchema = new Schema(
  {
    staff: { type: Schema.Types.ObjectId, ref: "staffs", required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

export const deductionModel = mongoose.model("deductions", deductionSchema);
