import joi from "joi";

const objectId = () => joi.string().length(24).hex();

export const addProductValidate = joi.object({
  name: joi.string().min(2).max(100).required(),
  description: joi.string().required(),
  price: joi.number().integer().min(0).required(),
  stock: joi.number().integer().min(0).required(),
  categoryId: objectId().required(),
  subCategoryId: objectId().required(),
});

export const updateProductValidate = joi.object({
  name: joi.string().min(2).max(100).required(),
  description: joi.string().allow("").required(),
  price: joi.number().integer().min(0).required(),
  stock: joi.number().integer().min(0).required(),
  categoryId: objectId().required(),
  subCategoryId: objectId().required(),
});
