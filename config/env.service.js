import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
let port = process.env.PORT;
let email = process.env.EMAIL;
let password = process.env.PASSWORD;
let hash = process.env.HASH;
let base_url = process.env.BASE_URL;
let signatureAdmin = process.env.SIGNATURE_ADMIN;
let signatureStaff = process.env.SIGNATURE_STAFF;
let signatureUser = process.env.SIGNATURE_USER;
let accessToken = process.env.ACCESS_TOKEN;
let refreshToken = process.env.REFRESH_TOKEN;
let databaseUrl = process.env.DATA_BASE_URL_MY;
let verifySignature = process.env.VERIFY_SIGNATURE_MY;
export const env = {
  port,
  email,
  password,
  hash,
  base_url,
  signatureAdmin,
  signatureUser,
  signatureStaff,
  accessToken,
  refreshToken,
  databaseUrl,
  verifySignature,
};
