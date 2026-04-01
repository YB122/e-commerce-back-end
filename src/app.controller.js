import express from "express";
import cors from "cors";

import { dataBaseConnection } from "./database/connection.js";
import { env } from "../config/env.service.js";


export const callServer = () => {
  let app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static("uploads"));
  dataBaseConnection();

  app.listen(env.port, () => {
    console.log("server 3000 open");
  });
};
