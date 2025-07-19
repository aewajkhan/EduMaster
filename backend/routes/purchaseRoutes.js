import express from "express";
import { verifyToken } from "./../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  downloadInvoice,
  getAllPurchases,
  getMyPurchases,
} from "../controllers/purchaseConteoller.js";
const router = express.Router();

router.get("/my", verifyToken, getMyPurchases);

router.get("/admin/all", verifyToken, isAdmin, getAllPurchases);
router.get("/invoice/:orderId", verifyToken, downloadInvoice);

export default router;
