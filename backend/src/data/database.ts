import { Account } from "../models/Account";

/**
 * Base de dados em memória.
 * Simula um repositório de contas com dados iniciais para demonstração.
 */
const accounts: Account[] = [
  {
    id: "1",
    holder: "Luna Castro",
    type: "CORRENTE",
    balance: 1500.0,
  },
  {
    id: "2",
    holder: "Kaleb Lima",
    type: "POUPANCA",
    balance: 800.0,
  },
  {
    id: "3",
    holder: "Carla Mendes",
    type: "CORRENTE",
    balance: 200.0,
  },
  {
    id: "4",
    holder: "Diego Costa",
    type: "POUPANCA",
    balance: 50.0,
  },
];

export function findAll(): Account[] {
  return accounts;
}

export function findById(id: string): Account | undefined {
  return accounts.find((acc) => acc.id === id);
}

export function save(account: Account): Account {
  accounts.push(account);
  return account;
}

export function update(updated: Account): Account | undefined {
  const index = accounts.findIndex((acc) => acc.id === updated.id);
  if (index === -1) return undefined;
  accounts[index] = updated;
  return accounts[index];
}
