import { useState } from "react";
import type { Account } from "../types";
import * as api from "../services/api";
import { Alert } from "./Alert";
import axios from "axios";

interface Props {
  account: Account;
  onSuccess: (updated: Account) => void;
}

// Formulário de saque para a conta selecionada.
export function WithdrawForm({ account, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const value = parseFloat(amount.replace(",", "."));
    if (isNaN(value) || value <= 0) {
      setErrorMsg("Informe um valor válido maior que zero.");
      return;
    }

    setLoading(true);
    try {
      const { message, account: updated } = await api.withdraw(
        account.id,
        value
      );
      setSuccessMsg(message);
      setAmount("");
      onSuccess(updated);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setErrorMsg(err.response.data.error as string);
      } else {
        setErrorMsg("Erro ao realizar saque. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Valor do saque (R$)
        </label>
        <input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {account.type === "CORRENTE" && (
          <p className="text-xs text-gray-400 mt-1">
            Uma tarifa de R$ 1,00 será cobrada nesta operação.
          </p>
        )}
      </div>

      {successMsg && <Alert type="success" message={successMsg} />}
      {errorMsg && <Alert type="error" message={errorMsg} />}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
      >
        {loading ? "Processando..." : "Realizar Saque"}
      </button>
    </form>
  );
}
