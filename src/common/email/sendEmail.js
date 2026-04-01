import nodemailer from "nodemailer";
import { env } from "../../../config/env.service.js";

export const sendEmail = async (email, subject, text, html) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // 587 if false 465 if true
    secure: false,
    auth: {
      user: env.email, 
      pass: env.password,
    },
  });

  let info = await transporter.sendMail({
    from: "app saraha",
    to: email,
    subject: subject,
    text: text,
    html: html,
  });
};
