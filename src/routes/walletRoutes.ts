import { Router } from "express";
import {
  rechargeWallet,
  makePayment,
  confirmPayment,
  getWalletBalance,
} from "../controllers/walletController";
import { validateSession } from "../middlewares/validateSession";
import { validateToken } from "../middlewares/validateToken";

const router = Router();

router.post("/recharge", rechargeWallet);
router.post("/pay", makePayment);
router.post(
  "/:paymentId/confirm",
  validateSession,
  validateToken,
  confirmPayment
);
router.get("/balance", getWalletBalance);

export default router;
