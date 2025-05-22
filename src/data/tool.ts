import { Prisma, Tool } from "@prisma/client";

// Get all tools
export async function getAllTools(): Promise<Tool[]> {
  try {
    const response = await fetch("/api/tools", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tools");
    }

    return response.json();
  } catch (error) {
    console.error("Error in getAllTools:", error);
    return [];
  }
}

// Create a new tool
export async function createTool(tool: Prisma.ToolCreateInput): Promise<Tool> {
  try {
    const response = await fetch("/api/tools", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tool),
    });

    if (!response.ok) {
      throw new Error("Failed to create tool");
    }

    return response.json();
  } catch (error) {
    console.error("Error in createTool:", error);
    throw error;
  }
}

// Update a tool's acquired status
export async function checkTool(id: number, acquired: boolean): Promise<Tool> {
  try {
    const response = await fetch(`/api/tools/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ aquired: acquired }),
    });

    if (!response.ok) {
      throw new Error("Failed to update tool");
    }

    return response.json();
  } catch (error) {
    console.error("Error in checkTool:", error);
    throw error;
  }
}

// Delete a tool
export async function deleteTool(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/tools/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete tool");
    }
  } catch (error) {
    console.error("Error in deleteTool:", error);
    throw error;
  }
} 