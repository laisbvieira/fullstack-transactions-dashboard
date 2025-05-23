import { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import { Filters, FilterValues } from "../../components/filters/Filters";
import { TransactionList } from "../../components/transaction-list/TransactionList";
import { UploadModal } from "../../components/uploadModal/UploadModal";
import styles from "./styles.module.css";
import { formatDate } from "../../utils/formatDate";
import { FaUpload } from "react-icons/fa";

export interface TransactionData {
  cpf: string;
  description: string;
  transactionDate: string;
  points: number;
  value: number;
  status: string;
}

const token = localStorage.getItem("authToken");
export const baseUrl = process.env.REACT_APP_API_URL || "";

export async function getTransactions(
  filters?: Partial<TransactionData>
): Promise<TransactionData[]> {
  let url = `${baseUrl}/transactions`;

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

export const AdminDashboard = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterValues>({});
  const [showUploadModal, setShowUploadModal] = useState(false);

  const headers: (keyof TransactionData)[] = [
    "cpf",
    "description",
    "transactionDate",
    "points",
    "value",
    "status",
  ];

  const labels: Partial<Record<keyof TransactionData, string>> = {
    cpf: "CPF",
    description: "Descrição",
    transactionDate: "Data",
    points: "Pontos",
    value: "Valor",
    status: "Status",
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${baseUrl}/transactions/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        const failedRows = result?.results?.filter((r: any) => r.error);
        const errorMessage =
          failedRows?.length > 0
            ? `Erros no upload: ${failedRows
                .map((r: any, i: number) => `Linha ${i + 2}: ${r.error}`)
                .join(", ")}`
            : result.message ||
              "Erro ao importar transações. Confira o arquivo e tente novamente!";

        throw new Error(errorMessage);
      }

      const newTransactions = await getTransactions(filters);
      setTransactions(newTransactions);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    getTransactions(filters)
      .then(setTransactions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>Bem-vindo(a), Admin</h3>
          <p className={styles.subtitle}>
            Visualize e acompanhe todas as transações realizadas no sistema.
            Você também pode fazer o upload de novas transações.
          </p>
        </div>
        <div className={styles.button}>
          <Button size="small" onClick={() => setShowUploadModal(true)}>
            <FaUpload /> Novas transações
          </Button>
        </div>
      </div>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}

      {loading && <p className={styles.loading}>Carregando transações...</p>}

      {error && (
        <div className={styles.error}>
          <strong>Erro:</strong>
          <ul>
            {error.split(", ").map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && transactions.length === 0 && (
        <div className={styles.empty}>
          <p>🔍 Nenhuma transação encontrada.</p>
        </div>
      )}

      {!loading && transactions.length > 0 && (
        <div className={styles.report}>
          <h5>Relatório de Transações</h5>
          <Filters role="admin" onChange={setFilters} />
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
  );
};
