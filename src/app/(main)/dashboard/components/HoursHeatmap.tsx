/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WorkHour } from "@prisma/client";

interface HoursHeatmapProps {
  workHoursRecord: Record<string, WorkHour>;
  isLoading: boolean;
}

export function HoursHeatmap({ workHoursRecord, isLoading }: HoursHeatmapProps) {
  const [cells, setCells] = useState<Array<{ date: Date; hours: number }>>([]);
  
  useEffect(() => {
    // Generate cells for the last 12 weeks (84 days)
    const generateCells = () => {
      const today = new Date();
      const cells = [];
      
      // Go back 84 days (12 weeks)
      for (let i = 83; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        // Format date as YYYY-MM-DD for lookup in workHoursRecord
        const dateKey = date.toISOString().split('T')[0];
        const hours = workHoursRecord[dateKey]?.hours || 0;
        
        cells.push({ date, hours });
      }
      
      return cells;
    };
    
    setCells(generateCells());
  }, [workHoursRecord]);
  
  // Get color based on hours worked - using primary color palette
  const getColor = (hours: number) => {
    if (hours === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (hours < 2) return 'bg-blue-100 dark:bg-blue-900';
    if (hours < 4) return 'bg-blue-300 dark:bg-blue-700';
    if (hours < 6) return 'bg-blue-500 dark:bg-blue-500';
    return 'bg-blue-700 dark:bg-blue-300';
  };
  
  // Format date for tooltip
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Group cells by week
  const weeks = [];
  for (let i = 0; i < 12; i++) {
    weeks.push(cells.slice(i * 7, (i + 1) * 7));
  }
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[90px] bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <div className="text-sm font-medium mb-2">Activity</div>
      <TooltipProvider>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>12 weeks ago</span>
            <span>Today</span>
          </div>
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((cell, dayIndex) => (
                  <Tooltip key={dayIndex}>
                    <TooltipTrigger asChild>
                      <div 
                        className={`w-3 h-3 rounded-sm ${getColor(cell.hours)}`}
                        aria-label={`${cell.hours} hours on ${formatDate(cell.date)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{formatDate(cell.date)}</p>
                      <p className="font-bold">{cell.hours} hours</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-1 mt-1">
            <div className="text-xs text-muted-foreground mr-1">Less</div>
            <div className="w-2 h-2 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
            <div className="w-2 h-2 rounded-sm bg-blue-100 dark:bg-blue-900"></div>
            <div className="w-2 h-2 rounded-sm bg-blue-300 dark:bg-blue-700"></div>
            <div className="w-2 h-2 rounded-sm bg-blue-500 dark:bg-blue-500"></div>
            <div className="w-2 h-2 rounded-sm bg-blue-700 dark:bg-blue-300"></div>
            <div className="text-xs text-muted-foreground ml-1">More</div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
} 