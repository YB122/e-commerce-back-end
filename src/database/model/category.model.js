import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    categoryImg: { type: String, required: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const categoryModel = mongoose.model("categories", categorySchema);
