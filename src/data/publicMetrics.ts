import { fetchWorkHours, calculateTotalHours } from "./workHours";
import { getInventoryPartsMetrics } from "./inventoryParts";
import { fetchAltStats } from "./altStats";
import { fetchTaskProgress } from "./task";



/**
 * Interface for public metrics data
 */
export interface PublicMetrics {
  hoursWorked: number;
  partsInstalled: number;
  totalParts: number;
  progressPercentage: number;
  taskProgress: {
    overallProgress: number;
    totalTasks: number;
    completedTasks: number;
  };
  altStats: {
    beersDrank: number;
    cigarsSmoked: number;
    lowesVisits: number;
    hoursDriven: number;
  };
}

/**
 * Fetches all metrics for the public page
 * @returns Promise with the combined metrics data
 */
export async function fetchPublicMetrics(): Promise<PublicMetrics> {
  try {
    // Fetch work hours
    const workHoursData = await fetchWorkHours();
    const totalHours = calculateTotalHours(workHoursData);
    
    // Fetch parts metrics
    const partsMetrics = await getInventoryPartsMetrics();
    
    // Fetch task progress
    const taskProgressData = await fetchTaskProgress();
    
    // Fetch alt stats
    const altStatsData = await fetchAltStats();
    
    return {
      hoursWorked: totalHours,
      partsInstalled: partsMetrics.installedParts,
      totalParts: partsMetrics.totalParts,
      progressPercentage: partsMetrics.installedPercentage,
      taskProgress: {
        overallProgress: taskProgressData.overallProgress,
        totalTasks: taskProgressData.totalTasks,
        completedTasks: taskProgressData.completedTasks
      },
      altStats: {
        beersDrank: altStatsData.beersDrank || 0,
        cigarsSmoked: altStatsData.cigarsSmoked || 0,
        lowesVisits: altStatsData.lowesVisits || 0,
        hoursDriven: altStatsData.hoursDriven || 0
      }
    };
  } catch (error) {
    console.error('Error fetching public metrics:', error);
    return {
      hoursWorked: 0,
      partsInstalled: 0,
      totalParts: 0,
      progressPercentage: 0,
      taskProgress: {
        overallProgress: 0,
        totalTasks: 0,
        completedTasks: 0
      },
      altStats: {
        beersDrank: 0,
        cigarsSmoked: 0,
        lowesVisits: 0,
        hoursDriven: 0
      }
    };
  }
}

