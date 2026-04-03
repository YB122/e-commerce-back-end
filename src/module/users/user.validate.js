import joi from "joi";

const PHONE_REGEX = /^(?:\+20|0)?1[0125]\d{8}$/;

export const updateProfileValidate = joi.object({
  name: joi.string().min(3).max(20).optional(),
  phone: joi.string().pattern(PHONE_REGEX).optional(),
  city: joi.string().min(3).max(20).optional(),
  country: joi.string().min(3).max(20).optional(),
  street: joi.string().min(3).max(30).optional(),
  zipcode: joi.string().min(3).max(10).optional(),
});
