import joi from "joi";

export const createCategoryValidate = joi.object({
  name: joi.string().min(2).max(50).required(),
  photo: joi.string().optional(),
});

export const updateCategoryValidate = joi.object({
  name: joi.string().min(2).max(50).optional(),
  photo: joi.string().optional(),
});
