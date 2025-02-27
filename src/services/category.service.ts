import { CategoryWithTransactions } from "@/lib/types/category";
import { Category } from "@prisma/client/edge";


export async function getAllCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<Category[]>;
}

export async function getCategoriesWithoutBudget(): Promise<CategoryWithTransactions[]> {
  const response = await fetch("/api/categories/unbudgeted", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<CategoryWithTransactions[]>;
}
