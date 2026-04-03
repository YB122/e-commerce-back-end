import express from "express";
// import cors from "cors";
import authRouter from "./module/auth/auth.controller.js";
import userRouter from "./module/users/user.controller.js";
import categoryRouter from "./module/categories/category.controller.js";
import subCategoryRouter from "./module/subCategories/subCategory.controller.js";
import productsRouter from "./module/products/product.controller.js";
import cartRouter from "./module/carts/cart.controller.js";
import { dataBaseConnection } from "./database/connection.js";
import { env } from "../config/env.service.js";

export const callServer = () => {
  let app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static("uploads"));
  dataBaseConnection();
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.use("/api/v1/products", productsRouter);
  app.use("/api/v1/cart", cartRouter);
  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Internal Server Error" });
  });
  app.listen(env.port, () => {
    console.log("server 3000 open");
  });
};
