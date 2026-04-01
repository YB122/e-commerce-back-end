import { Router } from "express";
import { validateInput } from "../../common/utils/validate.js";
import { upload } from "../../common/middleware/multer.js";
import { auth } from "../../common/middleware/auth.js";

import { updateProfileValidate } from "./user.validate.js";
import {
  getOwnProfile,
  softDelete,
  updateProfile,
  uploadProfileImage,
} from "./user.service.js";

const router = Router();

router.get("/profile", auth, getOwnProfile);
router.put(
  "/profile",
  auth,
  validateInput(updateProfileValidate),
  upload().single("avatar"),
  updateProfile,
);
router.delete("/profile", auth, softDelete);
router.post(
  "/upload-profile-image",
  auth,
  upload().single("profileImage"),
  uploadProfileImage,
);
export default router;
