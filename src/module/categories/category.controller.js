import { Router } from "express";
import {
  createCategory,
  updateCategory,
  softDeleteCategory,
  getAllCategoriesAdmin,
  getOneCategory,
  getAllCategoriesUser,
  getSubcategoriesByCategory,
} from "./category.service.js";
import {
  createCategoryValidate,
  updateCategoryValidate,
} from "./category.validate.js";
import { validateInput } from "../../common/utils/validate.js";
import { upload } from "../../common/middleware/multer.js";
import { auth } from "../../common/middleware/auth.js";

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
