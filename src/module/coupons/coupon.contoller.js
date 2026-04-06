import { Router } from "express";

import { validateInput } from "../../common/utils/validate.js";
import { auth } from "../../common/middleware/auth.js";
import { addNewCouponValidate, editCouponValidate } from "./coupon.validate.js";
import { addCoupon, getAllCouponsAdmin, getOneCouponAdmin, editOneCoupon, deleteCoupon, getAllCouponsUser, getOneCouponUser } from "./coupon.service.js";



const router = Router();

// Admin APIs

router.post("/admin", auth, validateInput(addNewCouponValidate), addCoupon);
router.get("/admin", auth, getAllCouponsAdmin);
router.get("/admin/:id", auth, getOneCouponAdmin);
router.put("/admin/:id", auth, validateInput(editCouponValidate), editOneCoupon);
router.delete("/admin/:id", auth, deleteCoupon);

// User APIs

router.get("/", auth, getAllCouponsUser);
router.get("/:id", auth, getOneCouponUser);

export default router;
