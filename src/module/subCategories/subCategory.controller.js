import { Router } from "express";

import {
  createSubCategoryValidate,
  updateSubCategoryValidate,
} from "./subCategory.validate.js";
import { validateInput } from "./../../common/utils/validate.js";

import { auth } from "./../../common/middleware/auth.js";
import {
  createSubCategory,
  getAllSubCategories,
  softDeleteSubCategory,
  updateSubCategory,
  getOneSubCategory,
} from "./subCategory.service.js";

const router = Router();

// Dashboard (Admin Only)

router.post(
  "/",
  auth,
  validateInput(createSubCategoryValidate),
  createSubCategory,
);
router.put(
  "/:id",
  auth,
  validateInput(updateSubCategoryValidate),
  updateSubCategory,
);
router.delete("/:id", auth, softDeleteSubCategory);
router.get("/admin",auth, getAllSubCategories);

// Public APIs

router.get("/:id", getOneSubCategory);

export default router;
