import { Tool } from "@prisma/client";

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