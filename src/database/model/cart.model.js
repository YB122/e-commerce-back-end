import mongoose from "mongoose";
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, required: false, min: 1, default: 1 },
  },
  { timestamps: true },
);

export const cartModel = mongoose.model("carts", cartSchema);
