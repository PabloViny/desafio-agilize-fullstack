import { Request, Response, NextFunction } from "express";
import * as accountService from "../services/accountService";

/*
 * GET /accounts
 * Lista todas as contas.
 */
export async function listAccounts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const accounts = await accountService.getAllAccounts();
    res.json(accounts);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /accounts/:id
 * Retorna uma conta específica.
 */
export async function getAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const account = await accountService.getAccountById(req.params.id);
    res.json(account);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /accounts/:id/withdraw
 * Realiza saque. Espera body: { amount: number }
 */
export async function withdrawFromAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { amount } = req.body as { amount: number };
    const account = await accountService.withdraw(req.params.id, amount);
    res.json({ message: "Saque realizado com sucesso.", account });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /transfer
 * Realiza transferência. Espera body: { fromId, toId, amount }
 */
export async function transferBetweenAccounts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { fromId, toId, amount } = req.body as {
      fromId: string;
      toId: string;
      amount: number;
    };
    const result = await accountService.transfer(fromId, toId, amount);
    res.json({ message: "Transferência realizada com sucesso.", ...result });
  } catch (error) {
    next(error);
  }
}
