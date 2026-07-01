import { v4 as uuidv4 } from "uuid";
import { Account } from "../models/Account";
import * as db from "../data/database";
import { AppError } from "../utils/AppError";

// Tarifa fixa cobrada nas operações de conta corrente
const CORRENTE_FEE = 1.0;
// Limite do cheque especial (saldo mínimo permitido para conta corrente)
const OVERDRAFT_LIMIT = -500.0;

// Retorna todas as contas cadastradas.
export async function getAllAccounts(): Promise<Account[]> {
  return db.findAll();
}

/**
 * Retorna uma conta pelo id.
 * Lança 404 se não encontrada.
 */
export async function getAccountById(id: string): Promise<Account> {
  const account = db.findById(id);
  if (!account) {
    throw new AppError(`Conta com id "${id}" não encontrada.`, 404);
  }
  return account;
}

/**
 * Realiza um saque em uma conta respeitando as regras de negócio:
 *
 * Conta Corrente:
 *   - Cobra tarifa fixa de R$ 1,00
 *   - Pode ficar negativa até o limite de R$ -500,00
 *   - (valor + tarifa) não pode ultrapassar esse limite
 *
 * Conta Poupança:
 *   - Sem tarifa
 *   - Não pode ficar negativa
 */
export async function withdraw(id: string, amount: number): Promise<Account> {
  if (amount <= 0) {
    throw new AppError("O valor do saque deve ser maior que zero.");
  }

  const account = await getAccountById(id);

  if (account.type === "CORRENTE") {
    const totalDeduction = amount + CORRENTE_FEE;
    const newBalance = account.balance - totalDeduction;

    if (newBalance < OVERDRAFT_LIMIT) {
      throw new AppError(
        `Saldo insuficiente. O saque de R$ ${amount.toFixed(2)} mais a tarifa de R$ ${CORRENTE_FEE.toFixed(2)} ultrapassaria o limite do cheque especial (R$ ${Math.abs(OVERDRAFT_LIMIT).toFixed(2)}).`
      );
    }

    const updated = { ...account, balance: newBalance };
    return db.update(updated) as Account;
  }

  // Conta Poupança
  const newBalance = account.balance - amount;
  if (newBalance < 0) {
    throw new AppError(
      `Saldo insuficiente. A conta poupança não pode ficar negativa. Saldo atual: R$ ${account.balance.toFixed(2)}.`
    );
  }

  const updated = { ...account, balance: newBalance };
  return db.update(updated) as Account;
}

/**
 * Transfere um valor entre duas contas.
 * As mesmas regras de saque se aplicam na conta de origem.
 * A conta de destino sempre recebe o valor cheio (sem tarifa).
 */
export async function transfer(
  fromId: string,
  toId: string,
  amount: number
): Promise<{ from: Account; to: Account }> {
  if (amount <= 0) {
    throw new AppError("O valor da transferência deve ser maior que zero.");
  }

  if (fromId === toId) {
    throw new AppError("A conta de origem e destino não podem ser a mesma.");
  }

  const from = await getAccountById(fromId);
  const to = await getAccountById(toId);

  // Calcula o débito na origem considerando a tarifa quando aplicável
  const fee = from.type === "CORRENTE" ? CORRENTE_FEE : 0;
  const totalDeduction = amount + fee;
  const newFromBalance = from.balance - totalDeduction;

  if (from.type === "CORRENTE" && newFromBalance < OVERDRAFT_LIMIT) {
    throw new AppError(
      `Saldo insuficiente. A transferência de R$ ${amount.toFixed(2)} mais a tarifa de R$ ${fee.toFixed(2)} ultrapassaria o limite do cheque especial (R$ ${Math.abs(OVERDRAFT_LIMIT).toFixed(2)}).`
    );
  }

  if (from.type === "POUPANCA" && newFromBalance < 0) {
    throw new AppError(
      `Saldo insuficiente. A conta poupança não pode ficar negativa. Saldo atual: R$ ${from.balance.toFixed(2)}.`
    );
  }

  const updatedFrom = db.update({ ...from, balance: newFromBalance }) as Account;
  const updatedTo = db.update({ ...to, balance: to.balance + amount }) as Account;

  return { from: updatedFrom, to: updatedTo };
}
