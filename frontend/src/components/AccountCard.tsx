import type { Account } from "../types";

interface Props {
  account: Account;
  selected: boolean;
  onSelect: (account: Account) => void;
}

const TYPE_LABEL: Record<Account["type"], string> = {
  CORRENTE: "Conta Corrente",
  POUPANCA: "Conta Poupança",
};

// Card clicável que representa uma conta.
export function AccountCard({ account, selected, onSelect }: Props) {
  const isNegative = account.balance < 0;

  return (
    <button
      onClick={() => onSelect(account)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:border-blue-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800">{account.holder}</p>
          <p className="text-sm text-gray-500">{TYPE_LABEL[account.type]}</p>
        </div>
        <div className="text-right">
          <p
            className={`text-lg font-bold ${
              isNegative ? "text-red-600" : "text-green-600"
            }`}
          >
            {account.balance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
          {account.type === "CORRENTE" && (
            <p className="text-xs text-gray-400">Tarifa: R$ 1,00/op</p>
          )}
        </div>
      </div>
    </button>
  );
}
