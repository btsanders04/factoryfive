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

// Calculate parts metrics
export async function getPartsMetrics() {
  try {
    const partsInventory = await getAllPartsInventory();
    
    const totalParts = partsInventory.reduce((acc, part) => acc + part.quantity, 0);
    const receivedParts = partsInventory.reduce((acc, part) => acc + part.quantityReceived, 0);
    const installedParts = partsInventory.filter((part) => part.status === "Installed").length;
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
    console.error("Error fetching parts metrics:", error);
    return {
      totalParts: 0,
      receivedParts: 0,
      installedParts: 0,
      receivedPercentage: 0,
      installedPercentage: 0,
    };
  }
} 