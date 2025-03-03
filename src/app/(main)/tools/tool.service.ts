import { Prisma, Tool } from "@prisma/client";

export async function getAllTools(): Promise<Tool[]> {
  const response = await fetch("/api/tools", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<Tool[]>;
}

export async function createTool(tool: Prisma.ToolCreateInput): Promise<Tool> {
  const response = await fetch("/api/tools", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tool),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<Tool>;
}

export async function deleteTool(id: number): Promise<Tool> {
  const response = await fetch(`/api/tools/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<Tool>;
}

export async function checkTool(id: number, checked: boolean): Promise<Tool> {
  const response = await fetch(`/api/tools/${id}`, {
    method: "PUT",
    body: JSON.stringify({ checked }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<Tool>;
}
