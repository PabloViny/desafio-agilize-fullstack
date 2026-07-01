export type AccountType = "CORRENTE" | "POUPANCA";

export interface Account {
  id: string;
  holder: string;
  type: AccountType;
  balance: number;
}

export interface WithdrawResponse {
  message: string;
  account: Account;
}

export interface TransferResponse {
  message: string;
  from: Account;
  to: Account;
}
