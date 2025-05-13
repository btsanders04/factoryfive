// Work hours data fetching functions

import { WorkHour } from "@prisma/client";

/**
 * Fetches all work hours from the API
 * @returns Promise with the work hours data
 */
export async function fetchWorkHours() {
  try {
    const response = await fetch('/api/workhours');
    const data = await response.json();
    
    if (!data) {
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error loading work hours:', error);
    return [];
  }
}

/**
 * Calculates the total hours worked from work hours data
 * @param workHours Array of work hour entries
 * @returns Total hours worked
 */
export function calculateTotalHours(workHours: WorkHour[]) {
  return workHours.reduce((total, entry) => total + (entry.hours || 0), 0);
}
