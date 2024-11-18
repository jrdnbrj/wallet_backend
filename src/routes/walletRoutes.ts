import { Router } from "express";
import {
  rechargeWallet,
  makePayment,
  confirmPayment,
  getWalletBalance,
} from "../controllers/walletController";

const router = Router();

router.post("/recharge", rechargeWallet);
router.post("/pay", makePayment);
router.post("/:paymentId/confirm", confirmPayment);
router.get("/:clientId/balance", getWalletBalance);

export default router;
