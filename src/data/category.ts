import { CategoryWithTransactions } from "@/lib/types/category";
import { Category, Prisma } from "@prisma/client";

/**
 * Fetches all categories from the API
 * @returns Promise resolving to an array of Category items
 */
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

/**
 * Updates a category by ID
 * @param id The ID of the category to update
 * @param name The new name for the category
 * @returns Promise resolving to the updated Category
 */
export async function updateCategory(id: number, name: string): Promise<Category> {
   const response = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id, name}),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<Category>;
}

/**
 * Fetches all categories without a budget
 * @returns Promise resolving to an array of CategoryWithTransactions items
 */
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

/**
 * Creates a new category
 * @param category The category data to create
 * @returns Promise resolving to the created CategoryWithTransactions
 */
export async function createCategory(category: Prisma.CategoryCreateInput): Promise<CategoryWithTransactions> {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<CategoryWithTransactions>;
} 