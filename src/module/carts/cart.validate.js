import joi from "joi";

export const addCartValidate = joi.object({
  user: joi.string().length(24).hex().required(),
  items: joi.array().items(
    joi.object({
      product: joi.string().length(24).hex().required(),
      quantity: joi.number().integer().min(1).required(),
      price: joi.number().min(0).required()
    })
  ).min(1).required(),
  paymentMethod: joi.string().valid('card', 'cod').required(),
  shippingAddress: joi.object({
    street: joi.string().required(),
    city: joi.string().required(),
    zipCode: joi.string().required(),
    country: joi.string().required()
  }).required()
});

export const updateCartValidate = joi.object({
  items: joi.array().items(
    joi.object({
      product: joi.string().length(24).hex(),
      quantity: joi.number().integer().min(1),
      price: joi.number().min(0)
    })
  ).optional(),
  paymentMethod: joi.string().valid('card', 'cod').optional(),
  paymentStatus: joi.string().valid('pending', 'completed', 'failed').optional(),
  orderStatus: joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').optional(),
  shippingAddress: joi.object({
    street: joi.string(),
    city: joi.string(),
    zipCode: joi.string(),
    country: joi.string()
  }).optional()
});
