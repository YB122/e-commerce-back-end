import mongoose from "mongoose";
const { Schema } = mongoose;

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    subCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "subCategories",
      required: true,
    },
    onSale: { type: Boolean, default: true, required: false },
    images: { type: [String], default: [], required: true },
    image: { type: String, required: true },
    isActiveAdmin: { type: Boolean, default: true, required: false },
    isActiveUser: { type: Boolean, default: true, required: false },
  },
  { timestamps: true },
);

export const productModel = mongoose.model("products", productsSchema);
