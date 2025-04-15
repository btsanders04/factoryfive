import { InventoryPart, InventoryCategory, InventoryBox } from "@prisma/client";

/**
 * Type representing an InventoryPart with its related Category and Box
 */
export type InventoryPartWithRelations = InventoryPart & {
  category: InventoryCategory & {
    box: InventoryBox;
  };
};

/**
 * Fetches all inventory parts with their related categories and boxes
 * @returns Promise resolving to an array of InventoryPart items with relations
 */
export async function getAllInventoryParts(): Promise<InventoryPartWithRelations[]> {
  const response = await fetch("/api/inventory-parts", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  
  return response.json() as Promise<InventoryPartWithRelations[]>;
}

/**
 * Calculate parts metrics from inventory parts
 */
export async function getInventoryPartsMetrics() {
  try {
    const parts = await getAllInventoryParts();
    
    const totalParts = parts.reduce((acc, part) => acc + part.quantityExpected, 0);
    const receivedParts = parts.reduce((acc, part) => acc + part.quantityReceived, 0);
    const installedParts = parts.filter((part) => part.quantityReceived === part.quantityExpected).length;
    
    const receivedPercentage = totalParts > 0 ? Math.round((receivedParts / totalParts) * 100) : 0;
    const installedPercentage = totalParts > 0 ? Math.round((installedParts / parts.length) * 100) : 0;
    
    return {
      totalParts,
      receivedParts,
      installedParts,
      receivedPercentage,
      installedPercentage,
    };
  } catch (error) {
    console.error("Error calculating parts metrics:", error);
    return {
      totalParts: 0,
      receivedParts: 0,
      installedParts: 0,
      receivedPercentage: 0,
      installedPercentage: 0,
    };
  }
}
