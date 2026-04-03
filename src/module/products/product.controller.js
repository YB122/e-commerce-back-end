import { Router } from "express";

import {
  updateProductValidate,
  addProductValidate,
} from "./product.validate.js";
import { validateInput } from "../../common/utils/validate.js";

import { auth } from "../../common/middleware/auth.js";
import {
  addProduct,
  getAllProductsAdmin,
  softDeleteProduct,
  updateProduct,
} from "./product.service.js";

const router = Router();

// Dashboard (Admin Only)

router.post("/", auth, validateInput(addProductValidate), addProduct);
router.put("/:id", auth, validateInput(updateProductValidate), updateProduct);
router.delete("/:id", auth, softDeleteProduct);
router.get("/admin", auth, getAllProductsAdmin);

// Public APIs



export default router;
