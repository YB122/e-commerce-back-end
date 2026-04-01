import joi from "joi";

// Password: min 8 chars, at least 1 uppercase letter and 1 number
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
// Egyptian phone numbers: optional +20 or leading 0, then 1 followed by 0,1,2 or 5 and 8 more digits
const PHONE_REGEX = /^(?:\+20|0)?1[0125]\d{8}$/;

export const signupValidate = joi.object({
  name: joi.string().min(3).max(20).required(),
  email: joi.string().email().required(),
  phone: joi.string().pattern(PHONE_REGEX).required(),
  password: joi.string().pattern(PASSWORD_REGEX).required(),
  confirmPassword: joi.any().valid(joi.ref("password")).required(),
  profileImage: joi.string().optional(),
  avatar: joi.string().optional(),
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
