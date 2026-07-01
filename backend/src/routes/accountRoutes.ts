import { Router } from "express";
import {
  listAccounts,
  getAccount,
  withdrawFromAccount,
  transferBetweenAccounts,
} from "../controllers/accountController";

const router = Router();

router.get("/accounts", listAccounts);
router.get("/accounts/:id", getAccount);
router.post("/accounts/:id/withdraw", withdrawFromAccount);
router.post("/transfer", transferBetweenAccounts);

export default router;
