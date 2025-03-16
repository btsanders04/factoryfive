import { TransactionWithRelations } from "@/lib/types/transactions";
import { Prisma, Transaction } from "@prisma/client";

export async function addTransaction(
  transactionData: Prisma.TransactionUncheckedCreateInput
): Promise<TransactionWithRelations> {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<TransactionWithRelations>;
}

export async function editTransaction(
  transactionData: Prisma.TransactionUncheckedUpdateInput
): Promise<TransactionWithRelations> {
  const response = await fetch(`/api/transactions/${transactionData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<TransactionWithRelations>;
}

export async function getAllTransactions(): Promise<
  TransactionWithRelations[]
> {
  const response = await fetch("/api/transactions", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const data = (await response.json()) as TransactionWithRelations[];
  return data.map((transaction) => ({
    ...transaction,
    date: new Date(transaction.date),
  }));
}

export async function deleteTransaction(id: number): Promise<Transaction> {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<Transaction>;
} 