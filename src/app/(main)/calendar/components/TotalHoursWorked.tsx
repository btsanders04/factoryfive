"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar as CalendarIcon, TrendingUp, Calendar } from "lucide-react";
import { getHoursData, HOURS_CONFIG } from "@/data/calendar";

interface TotalHoursWorkedProps {
  // Optional props to allow for customization - will override defaults from HOURS_CONFIG
  targetHours?: number;
  weeklyGoal?: number;
  monthlyGoal?: number;
}

export function TotalHoursWorked({ 
  targetHours, // Now optional, will use HOURS_CONFIG if not provided
  weeklyGoal,  // Now optional, will use HOURS_CONFIG if not provided
  monthlyGoal  // Now optional, will use HOURS_CONFIG if not provided
}: TotalHoursWorkedProps) {
  const [totalHours, setTotalHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState({
    targetHours: targetHours || HOURS_CONFIG.targetHours,
    weeklyGoal: weeklyGoal || HOURS_CONFIG.weeklyGoal,
    monthlyGoal: monthlyGoal || HOURS_CONFIG.monthlyGoal
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
        
        // Only update config if props weren't provided
        if (!targetHours || !weeklyGoal || !monthlyGoal) {
          setConfig({
            targetHours: targetHours || data.config.targetHours,
            weeklyGoal: weeklyGoal || data.config.weeklyGoal,
            monthlyGoal: monthlyGoal || data.config.monthlyGoal
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
  }, [targetHours, weeklyGoal, monthlyGoal]);
  
  // Calculate percentages
  const totalPercentage = Math.min(Math.round((totalHours / config.targetHours) * 100), 100);
  const weeklyPercentage = Math.min(Math.round((weeklyHours / config.weeklyGoal) * 100), 100);
  const monthlyPercentage = Math.min(Math.round((monthlyHours / config.monthlyGoal) * 100), 100);
  
  // Estimate completion date based on current progress and weekly rate
  const estimateCompletionDate = () => {
    const remainingHours = config.targetHours - totalHours;
    if (remainingHours <= 0) return "Completed!";
    if (weeklyHours <= 0) return "Unknown";
    
    const weeksRemaining = remainingHours / weeklyHours;
    const daysRemaining = Math.ceil(weeksRemaining * 7);
    
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysRemaining);
    
    return completionDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <p className="text-xs text-muted-foreground mt-2">{weeklyPercentage}% of weekly goal</p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[80px] flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">{monthlyHours} hrs</div>
              <p className="text-xs text-muted-foreground">of {config.monthlyGoal} hrs goal</p>
              <Progress value={monthlyPercentage} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">{monthlyPercentage}% of monthly goal</p>
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
                at current pace ({weeklyHours} hrs/week)
              </p>
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