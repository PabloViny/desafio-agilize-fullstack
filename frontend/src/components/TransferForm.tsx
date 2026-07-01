import { useState } from "react";
import type { Account } from "../types";
import * as api from "../services/api";
import { Alert } from "./Alert";
import axios from "axios";

interface Props {
  accounts: Account[];
  selectedAccount: Account;
  onSuccess: (from: Account, to: Account) => void;
}

// Formulário de transferência entre contas.
export function TransferForm({ accounts, selectedAccount, onSuccess }: Props) {
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const destinations = accounts.filter((a) => a.id !== selectedAccount.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!toId) {
      setErrorMsg("Selecione a conta de destino.");
      return;
    }

    const value = parseFloat(amount.replace(",", "."));
    if (isNaN(value) || value <= 0) {
      setErrorMsg("Informe um valor válido maior que zero.");
      return;
    }

    setLoading(true);
    try {
      const { message, from, to } = await api.transfer(
        selectedAccount.id,
        toId,
        value
      );
      setSuccessMsg(message);
      setAmount("");
      setToId("");
      onSuccess(from, to);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setErrorMsg(err.response.data.error as string);
      } else {
        setErrorMsg("Erro ao realizar transferência. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="destination"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Conta de destino
        </label>
        <select
          id="destination"
          value={toId}
          onChange={(e) => setToId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Selecione...</option>
          {destinations.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.holder} —{" "}
              {acc.type === "CORRENTE" ? "Corrente" : "Poupança"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="transfer-amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Valor (R$)
        </label>
        <input
          id="transfer-amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {selectedAccount.type === "CORRENTE" && (
          <p className="text-xs text-gray-400 mt-1">
            Uma tarifa de R$ 1,00 será cobrada desta conta.
          </p>
        )}
      </div>

      {successMsg && <Alert type="success" message={successMsg} />}
      {errorMsg && <Alert type="error" message={errorMsg} />}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
      >
        {loading ? "Processando..." : "Transferir"}
      </button>
    </form>
  );
}
