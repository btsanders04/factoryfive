import { PartsInventory } from "@prisma/client";

/**
 * Fetches all parts inventory items from the API
 * @returns Promise resolving to an array of PartsInventory items
 */
export async function getAllPartsInventory(): Promise<PartsInventory[]> {
  const response = await fetch("/api/partsinventory", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  
  return response.json() as Promise<PartsInventory[]>;
} 