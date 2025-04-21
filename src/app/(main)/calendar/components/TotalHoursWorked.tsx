"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar as CalendarIcon, TrendingUp } from "lucide-react";
import { getHoursData, HOURS_CONFIG } from "@/data/calendar";

interface TotalHoursWorkedProps {
  // Optional props to allow for customization - will override defaults from HOURS_CONFIG
  targetHours?: number;
  weeklyGoal?: number;
}

export function TotalHoursWorked({ 
  targetHours, // Now optional, will use HOURS_CONFIG if not provided
  weeklyGoal  // Now optional, will use HOURS_CONFIG if not provided
}: TotalHoursWorkedProps) {
  const [totalHours, setTotalHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [avgWeeklyHours, setAvgWeeklyHours] = useState(0);
  const [pastWeeks, setPastWeeks] = useState<number[]>([0, 0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState({
    targetHours: targetHours || HOURS_CONFIG.targetHours,
    weeklyGoal: weeklyGoal || HOURS_CONFIG.weeklyGoal
  });
  
  // Fetch real data from the calendar service
  useEffect(() => {
    const fetchHoursData = async () => {
      setIsLoading(true);
      try {
        const data = await getHoursData();
        
        setTotalHours(Math.round(data.totalHours));
        setWeeklyHours(Math.round(data.weeklyHours));
        setMonthlyHours(Math.round(data.monthlyHours));
        setAvgWeeklyHours(Math.round(data.avgWeeklyHours));
        setPastWeeks(data.pastWeeks.map(hours => Math.round(hours)));
        
        // Only update config if props weren't provided
        if (!targetHours || !weeklyGoal) {
          setConfig({
            targetHours: targetHours || data.config.targetHours,
            weeklyGoal: weeklyGoal || data.config.weeklyGoal
          });
        }
      } catch (error) {
        console.error("Error fetching hours data:", error);
        // Set fallback values if there's an error
        setTotalHours(0);
        setWeeklyHours(0);
        setMonthlyHours(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHoursData();
  }, [targetHours, weeklyGoal]);
  
  // Calculate percentages
  const totalPercentage = Math.min(Math.round((totalHours / config.targetHours) * 100), 100);
  const weeklyPercentage = Math.min(Math.round((weeklyHours / config.weeklyGoal) * 100), 100);
  
  // Estimate completion date based on current progress and 3-week average rate
  const estimateCompletionDate = () => {
    const remainingHours = config.targetHours - totalHours;
    if (remainingHours <= 0) return "Completed!";
    
    // Use the 3-week average if available, otherwise fall back to current week
    const rateToUse = avgWeeklyHours > 0 ? avgWeeklyHours : weeklyHours;
    if (rateToUse <= 0) return "Unknown";
    
    const weeksRemaining = remainingHours / rateToUse;
    const daysRemaining = Math.ceil(weeksRemaining * 7);
    
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysRemaining);
    
    return completionDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format the 3-week average for display
  const formatWeeklyAverage = () => {
    if (avgWeeklyHours <= 0) return `${weeklyHours} hrs/week`;
    return `${avgWeeklyHours} hrs/week (3-week avg)`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Hours Worked</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[80px] flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">{totalHours} hrs</div>
              <p className="text-xs text-muted-foreground">of {config.targetHours} hrs target</p>
              <Progress value={totalPercentage} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">{totalPercentage}% complete</p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[80px] flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">{weeklyHours} hrs</div>
              <p className="text-xs text-muted-foreground">of {config.weeklyGoal} hrs goal</p>
              <Progress value={weeklyPercentage} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {monthlyHours} hrs this month
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Estimated Completion</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[80px] flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">{estimateCompletionDate()}</div>
              <p className="text-xs text-muted-foreground">
                at average pace ({formatWeeklyAverage()})
              </p>
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-primary/20 rounded-full"></span>
                <span>Last 3 weeks: {pastWeeks[2]}, {pastWeeks[1]}, {pastWeeks[0]} hrs</span>
              </div>
              <div className="mt-2 text-sm">
                <span className="font-medium">{config.targetHours - totalHours} hrs</span> remaining
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 