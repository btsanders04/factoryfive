import { Prisma, WorkHour } from "@prisma/client";

// Configuration settings for hours tracking
export const HOURS_CONFIG = {
  targetHours: 500, // Total target hours for the project
  weeklyGoal: 16,   // Weekly goal in hours
  monthlyGoal: 64,  // Monthly goal in hours (4 weeks)
};

export async function updateHoursForDate(
  workHourData: Prisma.WorkHourUncheckedUpdateInput
): Promise<WorkHour> {
  const response = await fetch("/api/workhours", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workHourData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const data = (await response.json()) as WorkHour;
  return { ...data, date: new Date(data.date) };
}

export async function getAllWorkHours(): Promise<Record<string, WorkHour>> {
  const response = await fetch("/api/workhours", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  const workHoursArray = (await response.json()) as WorkHour[];
  const workHourRecord = workHoursArray.reduce(
    (record, workhour) => {
      // Format the date as a string (YYYY-MM-DD)
      const timestamp = workhour.date as unknown as string;
      const dateKey = timestamp.split('T')[0];
      // Add to the record with the date string as the key
      record[dateKey] = workhour;

      return record;
    },
    {} as Record<string, WorkHour>
  );
  return workHourRecord;
}

// Calculate total hours worked from work hours record
export function calculateTotalHoursWorked(workHoursRecord: Record<string, WorkHour>): number {
  return Object.values(workHoursRecord).reduce((total, workHour) => {
    return total + (workHour.hours || 0);
  }, 0);
}

// Calculate hours worked in the current week
export function calculateWeeklyHours(workHoursRecord: Record<string, WorkHour>): number {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  endOfWeek.setHours(23, 59, 59, 999);
  
  return Object.values(workHoursRecord).reduce((total, workHour) => {
    const workDate = new Date(workHour.date);
    if (workDate >= startOfWeek && workDate <= endOfWeek) {
      return total + (workHour.hours || 0);
    }
    return total;
  }, 0);
}

// Calculate hours worked in the current month
export function calculateMonthlyHours(workHoursRecord: Record<string, WorkHour>): number {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
  return Object.values(workHoursRecord).reduce((total, workHour) => {
    const workDate = new Date(workHour.date);
    if (workDate >= startOfMonth && workDate <= endOfMonth) {
      return total + (workHour.hours || 0);
    }
    return total;
  }, 0);
}

// Get hours data summary
export async function getHoursData() {
  try {
    const workHoursRecord = await getAllWorkHours();
    
    return {
      totalHours: calculateTotalHoursWorked(workHoursRecord),
      weeklyHours: calculateWeeklyHours(workHoursRecord),
      monthlyHours: calculateMonthlyHours(workHoursRecord),
      config: HOURS_CONFIG,
    };
  } catch (error) {
    console.error("Error fetching hours data:", error);
    // Return fallback data if API fails
    return {
      totalHours: 0,
      weeklyHours: 0,
      monthlyHours: 0,
      config: HOURS_CONFIG,
    };
  }
} 