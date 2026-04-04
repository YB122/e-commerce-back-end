import { Router } from "express";

import { validateInput } from "../../common/utils/validate.js";
import { auth } from "../../common/middleware/auth.js";
import { addCartValidate, updateCartValidate } from "./cart.validate.js";
import {
  addItemToCart,
  clearCart,
  removeItemFromCart,
  updateProductQuantity,
  viewCart,
} from "./cart.service.js";

const router = Router();

// Public APIs

router.post("/", auth, validateInput(addCartValidate), addItemToCart);
router.put(
  "/:productId",
  auth,
  validateInput(updateCartValidate),
  updateProductQuantity,
);
router.get("/", auth, viewCart);
router.delete("/:productId", auth, removeItemFromCart);
router.delete("/", auth, clearCart);

export default router;
