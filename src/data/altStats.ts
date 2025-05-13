// Alt stats data for tracking non-build related statistics

export type StatType = 'beersDrank' | 'cigarsSmoked' | 'lowesVisits' | 'hoursDriven';

export interface AltStats {
  beersDrank: number;
  cigarsSmoked: number;
  lowesVisits: number;
  hoursDriven: number;
}

// Default initial data
export const defaultAltStats: AltStats = {
  beersDrank: 0,
  cigarsSmoked: 0,
  lowesVisits: 0,
  hoursDriven: 0
};

/**
 * Fetches all alt statistics from the API
 * @returns Promise with the alt statistics data
 */
export async function fetchAltStats(): Promise<AltStats> {
  try {
    const response = await fetch('/api/alt-statistics');
    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data as AltStats;
    }
    
    return defaultAltStats;
  } catch (error) {
    console.error('Error loading statistics:', error);
    return defaultAltStats;
  }
}

/**
 * Increments a specific stat by 1
 * @param type The type of stat to increment
 * @returns Promise with the updated stat value
 */
export async function incrementAltStat(type: StatType): Promise<number | null> {
  try {
    const response = await fetch('/api/alt-statistics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type })
    });
    
    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data.count;
    }
    
    return null;
  } catch (error) {
    console.error(`Error incrementing ${type}:`, error);
    return null;
  }
}

/**
 * Updates a stat to a specific value
 * @param type The type of stat to update
 * @param count The new value for the stat
 * @returns Promise with the updated stat value
 */
export async function updateAltStat(type: StatType, count: number): Promise<number | null> {
  try {
    const response = await fetch('/api/alt-statistics', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, count })
    });
    
    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data.count;
    }
    
    return null;
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    return null;
  }
}
