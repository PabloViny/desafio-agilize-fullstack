/**
 * Erro de domínio da aplicação.
 * Usado para distinguir erros esperados (regras de negócio, not found)
 * de erros inesperados (bugs, falhas de infraestrutura).
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}
