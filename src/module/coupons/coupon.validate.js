import joi from "joi";

export const addNewCouponValidate = joi.object({
  type: joi.string().valid("offer", "announcement").required(),
  title: joi.string().min(3).max(50).required(),
  message: joi.string().min(3).max(200).required(),
  price: joi.number().min(0).max(100).optional(),
  expiresAt: joi.date().optional(),
  discountCode: joi.string().optional(),
});

export const editCouponValidate = joi.object({
  type: joi.string().valid("offer", "announcement").optional(),
  title: joi.string().min(3).max(50).optional(),
  message: joi.string().min(3).max(200).optional(),
  price: joi.number().min(0).max(100).optional(),
  expiresAt: joi.date().optional(),
  discountCode: joi.string().optional(),
});