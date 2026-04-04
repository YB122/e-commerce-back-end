import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    items: [{
      product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 },
      price: { type: Number, required: true, min: 0 }
    }],
    totalAmount: { type: Number, required: false, min: 0 },
    totalPrice: { type: Number, required: false, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['card', 'cod'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true }
    },
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("carts", orderSchema);
