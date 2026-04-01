import jwt from "jsonwebtoken";
import { env } from "./../../../config/env.service.js";

export const auth = (req, res, next) => {
  let { authorization } = req.headers;
  if (!authorization) {
    req.user = false;
    return next();
  }
  let [bearer, token] = authorization.split(" ");
  let signature = "";
  switch (bearer) {
    case "admin":
      signature = env.signatureAdmin;
      break;
    case "user":
      signature = env.signatureUser;
      break;
    case "staff":
      signature = env.signatureStaff;
      break;
    default:
      signature = "";
  }

  try {
    if (signature) {
      let decode = jwt.verify(token, signature);
      if (decode) {
        req.user = decode;
        req.bearer = bearer;
      } else {
        req.user = false;
      }
    } else {
      req.user = false;
    }
  } catch (e) {
    console.error("Token verification failed:", e);
    req.user = false;
  }

  next();
};

export const generateToken = (userSearch,expiresInDate) => {
  let signature = "";
  switch (userSearch.role) {
    case "admin":
      signature = env.signatureAdmin;
      break;
    case "user":
      signature = env.signatureUser;
      break;
      case "staff":
      signature = env.signatureStaff;
      break;
    default:
      signature = "";
  }
  if (!signature) {
    throw new Error("JWT signature is not configured properly");
  }
  return jwt.sign({ _id: userSearch._id }, signature, {expiresIn:expiresInDate});
};
