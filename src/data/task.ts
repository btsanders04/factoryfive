import { TaskSectionWithRelations } from "@/lib/types/tasks";
import { Prisma, Task } from "@prisma/client";

export async function getAllTaskSections(): Promise<{taskSections: TaskSectionWithRelations[], overallProgress: number, totalTasks: number, completedTasks: number}> {
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
  return response.json() as  Promise<{taskSections: TaskSectionWithRelations[], overallProgress: number, totalTasks: number, completedTasks: number}>;
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

/**
 * Fetches task sections with progress information
 * @returns Promise with task progress data
 */
export async function fetchTaskProgress() {
  try {
    const response = await fetch('/api/tasksections');
    const data = await response.json();
    
    return {
      overallProgress: data.overallProgress || 0,
      totalTasks: data.totalTasks || 0,
      completedTasks: data.completedTasks || 0
    };
  } catch (error) {
    console.error('Error fetching task progress:', error);
    return {
      overallProgress: 0,
      totalTasks: 0,
      completedTasks: 0
    };
  }
}