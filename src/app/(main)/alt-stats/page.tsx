'use client';

import { useState, useEffect } from 'react';
import { StatsCards } from './components/StatsCards';
import { StatsRadarChart } from './components/StatsRadarChart';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { fetchAltStats, incrementAltStat, type StatType, type AltStats } from '@/data/altStats';
import { fetchWorkHours, calculateTotalHours } from '@/data/workHours';

export default function AltStatsPage() {
  const [stats, setStats] = useState<Record<StatType, number>>({
    beersDrank: 0,
    cigarsSmoked: 0,
    lowesVisits: 0,
    hoursDriven: 0
  });
  const [totalHoursWorked, setTotalHoursWorked] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load statistics on component mount
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch alt stats
        const statsData = await fetchAltStats();
        setStats(statsData);
        
        // Fetch work hours
        const workHoursData = await fetchWorkHours();
        const totalHours = calculateTotalHours(workHoursData);
        setTotalHoursWorked(totalHours);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Function to increment a specific stat
  const handleIncrementStat = async (type: StatType) => {
    try {
      const updatedCount = await incrementAltStat(type);
      
      if (updatedCount !== null) {
        setStats(prev => ({
          ...prev,
          [type]: updatedCount
        }));
      } else {
        // Optimistic update if API fails
        setStats(prev => ({
          ...prev,
          [type]: (prev[type] || 0) + 1
        }));
      }
    } catch (error) {
      console.error(`Error incrementing ${type}:`, error);
    }
  };

  if (loading) {
    return (
      <div className="container py-6 flex justify-center items-center">
        <div className="text-center">
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Alt Stats</h1>
      </div>
      
      <StatsCards 
        beersDrank={stats.beersDrank}
        cigarsSmoked={stats.cigarsSmoked}
        lowesVisits={stats.lowesVisits}
        hoursDriven={stats.hoursDriven}
      />
      
      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <Button 
          onClick={() => handleIncrementStat('beersDrank')} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} /> Add Beer
        </Button>
        <Button 
          onClick={() => handleIncrementStat('cigarsSmoked')} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} /> Add Cigar
        </Button>
        <Button 
          onClick={() => handleIncrementStat('lowesVisits')} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} /> Add Lowes Visit
        </Button>
        <Button 
          onClick={() => handleIncrementStat('hoursDriven')} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} /> Add Driving Hour
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsRadarChart
          beersDrank={stats.beersDrank}
          cigarsSmoked={stats.cigarsSmoked}
          lowesVisits={stats.lowesVisits}
          hoursDriven={stats.hoursDriven}
          hoursWorked={totalHoursWorked}
        />
      </div>
    </div>
  );
}