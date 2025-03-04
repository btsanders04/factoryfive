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

export async function createTaskSection(
  data: Prisma.TaskSectionCreateInput
): Promise<TaskSectionWithRelations> {
  const response = await fetch(`/api/tasksections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<TaskSectionWithRelations>;
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

export async function createTask(
  taskData: Prisma.TaskUncheckedCreateInput
): Promise<Task> {
  const response = await fetch(`/api/tasks`, {
    method: "POST",
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

export async function deleteTask(
  id: number
): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<Task>;
}