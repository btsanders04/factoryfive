import { TaskSectionWithRelations } from "@/lib/types/tasks";
import { Prisma, Task } from "@prisma/client";

export async function getAllTaskSections(): Promise<TaskSectionWithRelations[]> {
  const response = await fetch("/api/tasksections", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<TaskSectionWithRelations[]>;
}


export async function updateTask(
  taskData: Prisma.TaskUncheckedUpdateInput
): Promise<Task> {
  const response = await fetch(`/api/tasks/${taskData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<Task>;
}