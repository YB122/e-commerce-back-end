import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "../../config/env.service.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const dataBaseConnection = () => {
  mongoose
    .connect(env.databaseUrl)
    .then(() => console.log("data base connected"))
    .catch((err) => console.log(err));
};
