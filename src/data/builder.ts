import { Builder } from "@prisma/client";

export type BuilderWithSpend = Builder & {
  spend: number;
};

/**
 * Fetches all builders from the API
 * @returns Promise resolving to an array of Builder items
 */
export async function getAllBuilders(): Promise<Builder[]> {
  const response = await fetch("/api/builders", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<Builder[]>;
}

/**
 * Fetches all builders with their spend amounts
 * @returns Promise resolving to an array of BuilderWithSpend items
 */
export async function getBuildersSpend(): Promise<BuilderWithSpend[]> {
  const response = await fetch("/api/builders/spend", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<BuilderWithSpend[]>;
} 