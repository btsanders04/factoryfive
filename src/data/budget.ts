import { BudgetWithRelations } from "@/lib/types/budget";
import { ActionType } from "@/lib/types/enum";

export type UpdateBudgetResponse = {
  budget: BudgetWithRelations;
  message: string;
  action: ActionType;
};

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

export async function upsertBudget(
  id: number,
  amount: number
): Promise<UpdateBudgetResponse> {
  const response = await fetch(`/api/categories/${id}/budget`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return await (response.json() as Promise<{
    message: string;
    budget: BudgetWithRelations;
    action: ActionType;
  }>);
} 