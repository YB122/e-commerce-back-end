import { userModel } from "../../database/model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../../common/email/sendEmail.js";
import { env } from "../../../config/env.service.js";
import { generateToken } from "../../common/middleware/auth.js";

export const signup = async (req, res) => {
  let { name, email, password, confirmPassword, role, phone } = req.body;
  let emailSearch = await userModel.findOne({ email });
  if (emailSearch && emailSearch.isActive) {
    return res.status(400).json({ message: "email already exist" });
  }
  if (password != confirmPassword) {
    return res.status(400).json({ message: "password not matched" });
  }

  let hashedPassword = await bcrypt.hash(password, 12);
  let avatar;
  if (req.file) {
    avatar = `${env.base_url}/uploads/${req.file.originalname}`;
  }
  // let profileImage;
  // if (req.file) {
  //   profileImage = `${env.base_url}/uploads/${req.file.originalname}`;
  // }
  let user;
  if (emailSearch) {
    user = await userModel.findOneAndUpdate(
      { email },
      {
        name,
        password: hashedPassword,
        phone,
        avatar,
        role,
        isActive: true,
      },
      { new: true },
    );
  } else {
    user = await userModel.insertMany({
      name,
      email,
      password: hashedPassword,
      avatar,
      role,
      phone,
    });
  }

  if (user) {
    let token = jwt.sign({ email }, env.verifySignature, { expiresIn: "1d" });
    let verifyButton = `<button>
    <a href="${env.base_url}/api/v1/auth/verify-email/${token}">verify account</a>
    </button>`;
    sendEmail(email, "verify your email", "verify", verifyButton);
    res.status(200).json({ message: "success, SignUp", data: user });
  } else {
    res.status(400).json({ message: "fail" });
  }
};

export const login = async (req, res) => {
  let { email, password } = req.body;
  let userSearch = await userModel.findOne({ email });
  if (userSearch?.isActive) {
    let data = await bcrypt.compare(password, userSearch.password);
    if (data) {
      if (!userSearch.isVerified) {
        return res.status(400).json({ message: "your email not verified" });
      }
      if (!userSearch.isActive) {
        res.status(400).json({ message: "your account pan" });
      }
      let accessToken = generateToken(userSearch, env.accessToken);
      let refreshToken = generateToken(userSearch, env.refreshToken);
      res.status(200).json({
        message: "login success",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      res.status(400).json({ message: "not found user or wrong password" });
    }
  } else {
    res.status(400).json({ message: "not found user or wrong password" });
  }
};

export const generateNewAccessToken = async (req, res) => {
  let { authorization } = req.headers;
  let [bearer, refreshToken] = authorization.split(" ");
  let signature = "";
  switch (bearer) {
    case "admin":
      signature = env.signatureAdmin;
      break;
    case "user":
      signature = env.refreshToken;
      break;
  }
  let decode = jwt.verify(refreshToken, signature);
  if (decode) {
    let accessToken = jwt.sign({ _id: decode._id }, signature, {
      expiresIn: "24h",
    });
    res.json({ message: "accessToken", accessToken: accessToken });
  }
};

export const verifyEmail = async (req, res) => {
  let { token } = req.params;
  let decode = jwt.verify(token, env.verifySignature);
  if (!decode) return res.status(400).json({ message: "invalid token" });
  let userFound = await userModel.findOne({ email: decode.email });
  if (userFound.isVerified) {
    return res.status(400).json({ message: "your email already verified" });
  }
  let user = await userModel.findByIdAndUpdate(
    userFound._id,
    {
      isVerified: true,
    },
    { new: true },
  );
  if (user) {
    return res.status(200).json({ message: "email verified successfully" });
  } else {
    return res.status(400).json({ message: "user not found" });
  }
};

export const resendVerification = async (req, res) => {
  let { email } = req.body;
  let userFound = await userModel.findOne({ email });
  if (!userFound && !userFound.isActive) {
    return res.status(400).json({ message: "user not found" });
  }
  if (userFound.isVerified) {
    return res.status(400).json({ message: "your email already verified" });
  }
  let token = jwt.sign({ email }, env.verifySignature, { expiresIn: "1d" });
  let verifyButton = `<button>
    <a href="${env.base_url}/api/v1/auth/verify-email/${token}">Reverify your account</a>
    </button>`;
  sendEmail(email, "Reverify your email", "Reverify", verifyButton);
  res.status(200).json({ message: "success, Reverify your email" });
};

export const forgetPassword = async (req, res) => {
  let { email } = req.body;
  let userFound = await userModel.findOne({ email });
  if (!userFound && !userFound.isActive) {
    return res.json({ message: "user not found" });
  }
  let otp = Math.floor(100000 + Math.random() * 900000).toString();
  userFound.otp = otp;
  await userFound.save();
  sendEmail(email, "verify your email", `your otp is ${otp}`);
  res.json({ message: "check your mail" });
};

export const resetPassword = async (req, res) => {
  let { otp, newPassword, confirmNewPassword, email } = req.body;
  if (newPassword != confirmNewPassword) {
    return res.json({ message: "password not matched" });
  }
  let userFound = await userModel.findOne({ email });
  if (!userFound && !userFound.isActive) {
    return res.json({ message: "user not found" });
  }
  if (otp != userFound.otp) {
    return res.status(400).json({ message: "otp not correct" });
  }
  let newHashedPassword = await bcrypt.hash(newPassword, 12);
  userFound.password = newHashedPassword;
  userFound.otp = null;
  await userFound.save();
  res.json({ message: "password updated successfully" });
};
