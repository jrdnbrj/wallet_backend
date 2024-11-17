import { Router } from "express";
import { registerClient } from "../controllers/clientController";

const router = Router();

router.post("/register", registerClient);

export default router;
