import express from "express";
// import cors from "cors";
import authRouter from './module/auth/auth.controller.js'
import userRouter from './module/users/user.controller.js'
import categoryRouter from './module/categories/category.controller.js'
import { dataBaseConnection } from "./database/connection.js";
import { env } from "../config/env.service.js";


export const callServer = () => {
  let app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static("uploads"));
  dataBaseConnection();
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/categories', categoryRouter);
  app.listen(env.port, () => {
    console.log("server 3000 open");
  });
};
