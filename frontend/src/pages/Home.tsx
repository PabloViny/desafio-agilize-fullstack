import { useState } from "react";
import type { Account } from "../types";
import { AccountCard } from "../components/AccountCard";
import { WithdrawForm } from "../components/WithdrawForm";
import { TransferForm } from "../components/TransferForm";
import { Alert } from "../components/Alert";

type Tab = "withdraw" | "transfer";

// Página principal do Banco Digital.
export function Home() {
  const { accounts, loading, error, reload } = useAccounts();
  const [selected, setSelected] = useState<Account | null>(null);
  const [tab, setTab] = useState<Tab>("withdraw");

  // Atualiza o saldo da conta na lista local após uma operação bem-sucedida.
  function syncAccount(updated: Account) {
    if (selected?.id === updated.id) setSelected(updated);
    reload();
  }

  function handleTransferSuccess(from: Account, to: Account) {
    syncAccount(from);
    syncAccount(to);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">🏦 Banco Digital</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie suas contas de forma simples
          </p>
        </header>

        {/* Lista de contas */}
        <section className="bg-white rounded-2xl shadow p-5 space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Contas</h2>

          {loading && (
            <p className="text-gray-400 text-sm">Carregando contas...</p>
          )}

          {error && <Alert type="error" message={error} />}

          {!loading && !error && accounts.length === 0 && (
            <p className="text-gray-400 text-sm">Nenhuma conta encontrada.</p>
          )}

          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              selected={selected?.id === account.id}
              onSelect={setSelected}
            />
          ))}
        </section>

        {/* Painel de operações */}
        {selected && (
          <section className="bg-white rounded-2xl shadow p-5 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Operações —{" "}
                <span className="text-blue-600">{selected.holder}</span>
              </h2>
              <p className="text-sm text-gray-500">
                Saldo atual:{" "}
                <span
                  className={`font-semibold ${
                    selected.balance < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {selected.balance.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setTab("withdraw")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  tab === "withdraw"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Saque
              </button>
              <button
                onClick={() => setTab("transfer")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  tab === "transfer"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Transferência
              </button>
            </div>

            {/* Formulários */}
            {tab === "withdraw" && (
              <WithdrawForm
                account={selected}
                onSuccess={syncAccount}
              />
            )}
            {tab === "transfer" && (
              <TransferForm
                accounts={accounts}
                selectedAccount={selected}
                onSuccess={handleTransferSuccess}
              />
            )}
          </section>
        )}

        {!selected && !loading && !error && (
          <p className="text-center text-gray-400 text-sm">
            Selecione uma conta acima para realizar operações.
          </p>
        )}
      </div>
    </div>
  );
}
