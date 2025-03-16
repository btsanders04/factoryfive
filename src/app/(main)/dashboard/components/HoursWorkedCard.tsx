"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, TrendingUp, Calendar } from "lucide-react";
import { getHoursData, HOURS_CONFIG } from "@/data/calendar";
import Link from "next/link";

export default function HoursWorkedCard() {
  const [totalHours, setTotalHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState(HOURS_CONFIG); // Default from import, will be updated
  
  // Fetch real data from the calendar service
  useEffect(() => {
    const fetchHoursData = async () => {
      setIsLoading(true);
      try {
        const data = await getHoursData();
        
        setTotalHours(Math.round(data.totalHours));
        setWeeklyHours(Math.round(data.weeklyHours));
        setMonthlyHours(Math.round(data.monthlyHours));
        setConfig(data.config); // Update config from API response
      } catch (error) {
        console.error("Error fetching hours data:", error);
        // Set fallback values if there's an error
        setTotalHours(0);
        setWeeklyHours(0);
        setMonthlyHours(0);
        // Config will remain as default from import
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHoursData();
  }, []);
  
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
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[80px] flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
          </div>
        ) : (
          <>
            {/* Total Hours Section */}
            <div className="mb-4">
              <div className="text-2xl font-bold">{totalHours} hrs</div>
              <p className="text-xs text-muted-foreground">of {config.targetHours} hrs target</p>
              <Progress value={totalPercentage} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{totalPercentage}% complete</p>
            </div>
            
            {/* This Week Section */}
            <div className="mb-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-muted-foreground" />
                  This Week
                </div>
                <div className="text-sm font-medium">{weeklyHours} hrs</div>
              </div>
              <Progress value={weeklyPercentage} className="h-2 mt-2" />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">Goal: {config.weeklyGoal} hrs</p>
                <p className="text-xs text-muted-foreground">{weeklyPercentage}%</p>
              </div>
            </div>
            
            {/* This Month Section */}
            <div className="mb-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                  This Month
                </div>
                <div className="text-sm font-medium">{monthlyHours} hrs</div>
              </div>
              <Progress value={monthlyPercentage} className="h-2 mt-2" />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">Goal: {config.monthlyGoal} hrs</p>
                <p className="text-xs text-muted-foreground">{monthlyPercentage}%</p>
              </div>
            </div>
            
            {/* Estimated Completion */}
            <div className="text-sm mt-4">
              <span className="font-medium">Est. completion:</span> {estimateCompletionDate()}
            </div>
            
            {/* Link to calendar */}
            <div className="mt-4">
              <Link 
                href="/calendar" 
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline block"
              >
                View full calendar →
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 