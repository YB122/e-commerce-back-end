import joi from "joi";

export const addOrderValidate = joi.object({
  productIds: joi.array().items(joi.string().length(24).hex().required()).required(),
  paymentMethod: joi.string().lowercase().valid("card", "cod").required(),
});

export const updateOrderStatusValidate = joi.object({
  orderStatus: joi
    .string()
    .valid(
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "payment",
    )
    .required(),
});
