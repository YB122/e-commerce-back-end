import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    photo: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    // subCategories: {
    //   type: [mongoose.Types.ObjectId],
    //   ref: "subCategories",
    //   required: false,
    // },
  },
  { timestamps: true },
);

export const categoryModel = mongoose.model("categories", categorySchema);
