import { InventoryPart, InventoryCategory, InventoryBox } from "@prisma/client";
import { BoxData } from "@/lib/types/inventory";

// Define a type for part updates that includes the status field
type PartUpdateData = {
  quantityReceived?: number;
  status?: string;
  // Add other fields that might be updated
};

/**
 * Type representing an InventoryPart with its related Category and Box
 * and including the status field that was added to the schema
 */
export type InventoryPartWithRelations = InventoryPart & {
  category: InventoryCategory;
  box: InventoryBox;
  status?: string; // Add the status field to match the schema
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
    const installedPercentage = totalParts > 0 ? Math.round((installedParts / totalParts) * 100) : 0;
    
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

export async function saveInventoryParts(parts: BoxData[]) {
  const response = await fetch("/api/inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parts),
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
 * Updates an inventory part with new data
 * @param partId The ID of the part to update
 * @param data The data to update the part with
 * @returns Promise resolving to the updated part
 */
export async function updateInventoryPart(partId: string, data: PartUpdateData): Promise<InventoryPartWithRelations> {
  const response = await fetch(`/api/inventory-parts/${partId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  
  return response.json() as Promise<InventoryPartWithRelations>;
}

/**
 * Marks a part as received by updating its quantityReceived to match quantityExpected
 * @param partId The ID of the part to mark as received
 * @returns Promise resolving to the updated part
 */
export async function markPartAsReceived(partId: string): Promise<InventoryPartWithRelations> {
  // First get the part to know its expected quantity
  const part = await fetch(`/api/inventory-parts/${partId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(res => {
    if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
    return res.json();
  });
  
  // Then update the part to mark it as received
  return updateInventoryPart(partId, {
    quantityReceived: part.quantityExpected,
    status: "Received"
  });
}
