import { useState, useEffect, useCallback } from "react";
import type { Account } from "../types";
import * as api from "../services/api";

interface UseAccountsReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

// Hook que carrega e gerencia a lista de contas da API.
export function useAccounts(): UseAccountsReturn {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchAccounts();
      setAccounts(data);
    } catch {
      setError("Não foi possível carregar as contas. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { accounts, loading, error, reload: load };
}
