import { useEffect, useState } from "react";
import { TransactionList } from "../../components/transaction-list/TransactionList";
import styles from "./styles.module.css";
import { Wallet } from "../../components/wallet/Wallet";
import { formatDate } from "../../utils/formatDate";
import { baseUrl } from "../AdminDashboard";
import { Filters, FilterValues } from "../../components/filters/Filters";

export interface TransactionData {
  description: string;
  transactionDate: string;
  points: number;
  value: number;
  status: string;
}

export async function getTransactions(
  filters?: Partial<TransactionData>
): Promise<TransactionData[]> {
  const token = localStorage.getItem("authToken");
  let url = `${baseUrl}/transactions/`;

  if (filters) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });

    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao buscar transações");
  }

  return response.json();
}

export const UserDashboard = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ name: string; balance: number } | null>(
    null
  );
  const [filters, setFilters] = useState<FilterValues>({});

  const headers: (keyof TransactionData)[] = [
    "description",
    "transactionDate",
    "points",
    "value",
    "status",
  ];

  const labels: Partial<Record<keyof TransactionData, string>> = {
    description: "Descrição",
    transactionDate: "Data",
    points: "Pontos",
    value: "Valor",
    status: "Status",
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const parsed = JSON.parse(userString);
        setUser(parsed);
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
      }
    }
    setLoading(true);
    getTransactions(filters)
      .then(setTransactions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  if (!user) {
    return <p className={styles.loading}>Carregando usuário...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>Bem-vindo(a), {user.name}</h3>
          <p className={styles.subtitle}>Acompanhe suas transações!</p>
        </div>
      </div>

      {loading && <p className={styles.loading}>Carregando transações...</p>}

      {error && <div className={styles.error}>Erro: {error}</div>}

      {!loading && !error && transactions.length === 0 && (
        <div className={styles.empty}>
          <p>🔍 Nenhuma transação encontrada.</p>
        </div>
      )}

      <div className={styles.dash}>
        <div className={styles.wallet}>
          <Wallet balance={user.balance} />
        </div>

        {!loading && transactions.length > 0 && (
          <div className={styles.report}>
            <h4>Extrato de Transações</h4>
            <Filters role="user" onChange={setFilters} />

            <TransactionList<TransactionData>
              headers={headers}
              labels={labels}
              data={transactions}
             renderCell={(row, key) => {
              if (key === "transactionDate") {
                return formatDate(row.transactionDate);
              }
              if (key === "status" && typeof row.status === "string") {
                return row.status.charAt(0).toUpperCase() + row.status.slice(1);
              }
              return row[key] as React.ReactNode;
            }}
          />
          </div>
        )}
      </div>
    </div>
  );
};
