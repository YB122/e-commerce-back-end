import joi from "joi";

export const createSubCategoryValidate = joi.object({
  name: joi.string().min(2).max(50).required(),
  categoryId: joi.string().length(24).hex().required(),
});

export const updateSubCategoryValidate = joi.object({
  name: joi.string().min(2).max(50).optional(),
  categoryId: joi.string().length(24).hex().optional(),
});
