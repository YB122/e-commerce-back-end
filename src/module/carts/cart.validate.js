import joi from "joi";

export const addCartValidate = joi.object({
  productId: joi.string().length(24).hex().required(),
  quantity: joi.number().integer().min(1).optional().default(1),
});

export const updateCartValidate = joi.object({
  quantity: joi.number().integer().min(1).required(),
});
