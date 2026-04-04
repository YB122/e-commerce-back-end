import { Router } from "express";

import { validateInput } from "../../common/utils/validate.js";
import { auth } from "../../common/middleware/auth.js";
import {
  updateOrderStatusValidate,
  addOrderValidate,
} from "./order.validate.js";
import { addOrder, getAllOrders, getMyOrder, getMyOrders, updateOrderStatus } from "./order.service.js";

const router = Router();

// Users APIs

router.post("/checkout", auth, validateInput(addOrderValidate), addOrder);
router.get("/", auth, getMyOrders);
router.get("/:id", auth, getMyOrder);

// Admin APIs

router.get("/admin", auth, getAllOrders);
router.patch(
  "/admin/:id/status",
  auth,
  validateInput(updateOrderStatusValidate),
  updateOrderStatus,
);

export default router;
