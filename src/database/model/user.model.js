import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true, required: false },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String, required: false },
    profileImage: { type: String, required: false },
    otp: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    street: { type: String, required: false },
    zipcode: { type: String, required: false },
  },
  { timestamps: true },
);

export const userModel = mongoose.model("users", userSchema);
