import { Router } from "express";


import { validateInput } from "../../common/utils/validate.js";
import { auth } from "../../common/middleware/auth.js";
import { addCartValidate, updateCartValidate } from "./cart.validate.js";

const router = Router();

// Dashboard (Admin Only)

router.post(
  "/",
  auth,
  validateInput(createCategoryValidate),
  upload().single("categoryImg"),
  createCategory,
);
router.put(
  "/:id",
  auth,
  validateInput(updateCategoryValidate),
  upload().single("categoryImg"),
  updateCategory,
);
router.delete("/:id", auth, softDeleteCategory);
router.get("/admin", auth, getAllCategoriesAdmin);
router.get("/:id/admin", auth, getOneCategory);

// Public APIs

router.get("/", getAllCategoriesUser);
router.get("/:id/subcategories", getSubcategoriesByCategory);

export default router;
