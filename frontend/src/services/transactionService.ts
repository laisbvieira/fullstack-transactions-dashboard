import { baseUrl } from "../pages/AdminDashboard";

export interface TransactionData {
  description: string;
  transactionDate: string;
  points: number;
  value: number;
  status: string;
  cpf: string;
}

export async function getTransactions(filters?: Partial<TransactionData>): Promise<TransactionData[]> {
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
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao buscar transações");
  }

  return response.json();
}

export async function createTransaction(data: TransactionData): Promise<TransactionData> {
  const response = await fetch(`${baseUrl}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao criar transação");
  }

  return response.json();
}
