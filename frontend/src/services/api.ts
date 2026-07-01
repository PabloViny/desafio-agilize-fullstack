import axios from "axios";
import type { Account, WithdrawResponse, TransferResponse } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});

export async function fetchAccounts(): Promise<Account[]> {
  const { data } = await api.get<Account[]>("/accounts");
  return data;
}

export async function fetchAccount(id: string): Promise<Account> {
  const { data } = await api.get<Account>(`/accounts/${id}`);
  return data;
}

export async function withdraw(
  id: string,
  amount: number
): Promise<WithdrawResponse> {
  const { data } = await api.post<WithdrawResponse>(
    `/accounts/${id}/withdraw`,
    { amount }
  );
  return data;
}

export async function transfer(
  fromId: string,
  toId: string,
  amount: number
): Promise<TransferResponse> {
  const { data } = await api.post<TransferResponse>("/transfer", {
    fromId,
    toId,
    amount,
  });
  return data;
}
