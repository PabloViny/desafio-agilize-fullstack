import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

/**
 * Middleware global de tratamento de erros.
 * Distingue erros de domínio (AppError) de erros inesperados.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error("[Erro interno]", err);
  res.status(500).json({ error: "Erro interno do servidor." });
}
