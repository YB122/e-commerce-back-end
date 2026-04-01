import { Router } from "express";
import {
  createCategory,
  updateCategory,
  softDeleteCategory,
  getAllCategories,
} from "./category.service.js";
import {
  createCategoryValidate,
  updateCategoryValidate,
} from "./category.validate.js";
import { validateInput } from "../../common/utils/validate.js";
import { upload } from "../../common/middleware/multer.js";
import { auth } from "../../common/middleware/auth.js";

const router = Router();

router.post(
  "/",
  auth,
  validateInput(createCategoryValidate),
  upload().single("photo"),
  createCategory,
);
router.put(
  "/:id",
  auth,
  validateInput(updateCategoryValidate),
  upload().single("photo"),
  updateCategory,
);
router.delete("/:id",auth, softDeleteCategory);
router.get("/", getAllCategories);

export default router;
