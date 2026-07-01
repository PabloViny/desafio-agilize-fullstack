export type AccountType = "CORRENTE" | "POUPANCA";

export interface Account {
  id: string;
  holder: string;
  type: AccountType;
  balance: number;
}
