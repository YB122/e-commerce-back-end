import jwt from "jsonwebtoken";
import { env } from "./../../../config/env.service.js";

export const auth = (req, res, next) => {
  let { authorization } = req.headers;
  let [bearer, token] = authorization.split(" ");
  let signature = "";
  switch (bearer) {
    case "admin":
      signature = env.signatureAdmin;
      break;
    case "user":
      signature = env.signatureUser;
      break;
  }
  let decode = jwt.verify(token, signature);
  req.user = decode;
  next();
};

export const generateToken = (userSearch) => {
  let signature = "";
  switch (userSearch.role) {
    case "admin":
      signature = env.signatureAdmin;
      break;
    case "user":
      signature = env.signatureUser;
      break;
  }
  return jwt.sign({ _id: userSearch._id }, signature);
};
