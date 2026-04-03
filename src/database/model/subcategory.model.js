import mongoose from "mongoose";
const { Schema } = mongoose;

const subCategoriesSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const subCategoryModel = mongoose.model(
  "subCategories",
  subCategoriesSchema,
);
