import { BudgetWithRelations } from "@/lib/types/budget";

export async function getAllBudgets(): Promise<BudgetWithRelations[]> {
  const response = await fetch("/api/budget", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<BudgetWithRelations[]>;
}
