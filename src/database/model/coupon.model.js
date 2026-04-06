import mongoose from "mongoose";
const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    message: { type: String, required: true },
    price: { type: Number, required: false, min: 0, max: 100 },
    isActive: { type: Boolean, default: true, required: false },
    type: { type: String, required: true, enum: ['offer', "announcement"] },
    discountCode: { type: String, required: false },
    expiresAt: { type: Date, required: false }
  },
  { timestamps: true },
);

export const couponModel = mongoose.model("coupons", couponSchema);
