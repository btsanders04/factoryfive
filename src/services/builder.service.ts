import { Builder } from "@prisma/client";

export type BuilderWithSpend = Builder & {
  spend: number;
};
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
