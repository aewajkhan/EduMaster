import express from "express";
import {
  createUserCtrl,
  deleteUserCtrl,
  getUserCTrl,
  loginUserCtrl,
  testCtrl,
  updateUserCtrl,
} from "../controllers/userControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "./../middleware/fileUpload.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getUserCTrl);

router.post("/", upload.single("profileImage"), createUserCtrl);

router.post("/login", loginUserCtrl);

router.get("/test", verifyToken,isAdmin, testCtrl);

router.put("/update",verifyToken,upload.single("profileImage"),updateUserCtrl)
router.delete("/delete/:_id",deleteUserCtrl)

export default router;
