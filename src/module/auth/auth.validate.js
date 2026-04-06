import joi from "joi";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_REGEX = /^(?:\+20|0)?1[0125]\d{8}$/;

export const signupValidate = joi.object({
  name: joi.string().min(3).max(20).required(),
  email: joi.string().email().required(),
  phone: joi.string().pattern(PHONE_REGEX).required(),
  password: joi.string().pattern(PASSWORD_REGEX).required(),
  confirmPassword: joi.any().valid(joi.ref("password")).required(),
  role: joi
    .string()
    .lowercase()
    .valid("admin", "user", "staff")
    .default("user")
    .optional(),
 
});

export const loginValidate = joi.object({
  email: joi.string().email().required(),
  password: joi.string().pattern(PASSWORD_REGEX).required(),
});

export const resendVerificationValidate = joi.object({
  email: joi.string().email().required(),
});

export const forgotPasswordValidate = joi.object({
  email: joi.string().email().required(),
});

export const resetPasswordValidate = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().required(),
  newPassword: joi.string().pattern(PASSWORD_REGEX).required(),
  confirmNewPassword: joi.any().valid(joi.ref("newPassword")).required(),
});
