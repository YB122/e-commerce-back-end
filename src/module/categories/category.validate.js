import joi from "joi";

export const createCategoryValidate = joi.object({
  name: joi.string().min(2).max(50).required(),
  
});

export const updateCategoryValidate = joi.object({
  name: joi.string().min(2).max(50).optional(),
  
});
