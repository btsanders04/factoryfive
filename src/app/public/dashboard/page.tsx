'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Wrench, PercentSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchPublicMetrics, type PublicMetrics } from '@/data/publicMetrics';

export default function PublicPage() {
  const [metrics, setMetrics] = useState<PublicMetrics>({
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
  });
  const [loading, setLoading] = useState(true);

  // Load metrics on component mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchPublicMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <p>Loading build statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold">Factory Five Roadster Build</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Follow along with my brother and I&apos;s journey building a Factory Five MK5 Roadster
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-2xl">Build Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                title="Hours Worked" 
                value={metrics.hoursWorked} 
                icon={<Clock size={24} />}
                unit="hrs"
              />
              <StatCard 
                title="Parts Installed" 
                value={metrics.partsInstalled} 
                icon={<Wrench size={24} />}
                secondaryText={`of ${metrics.totalParts} total parts`}
              />
              <StatCard 
                title="Parts Progress" 
                value={metrics.progressPercentage} 
                icon={<PercentSquare size={24} />}
                unit="%"
              />
              <StatCard 
                title="Overall Progress" 
                value={Math.round(metrics.taskProgress.overallProgress)} 
                icon={<PercentSquare size={24} />}
                unit="%"
                secondaryText={`${metrics.taskProgress.completedTasks} of ${metrics.taskProgress.totalTasks} tasks`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>About the Build</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              My brother, Jared Sanders, and I, Brandon Sanders, are building a Factory Five MK5 Roadster, a modern interpretation of the classic 1965Shelby Cobra. 
              This public dashboard shows our current build progress and statistics along with a link to regularly published milestones and a photo gallery. We hope you enjoy following our journey!
            </p>
          </CardContent>
        </Card>



        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle>Project Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Want to learn more about our Factory Five build or see more details?
              </p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link href="/public/buildlog" className="flex items-center gap-2">
                    <span>Detailed Build Progress</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="https://www.factoryfive.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <span>Factory Five Website</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Enhanced stat card component
function StatCard({ 
  title, 
  value, 
  icon, 
  unit, 
  secondaryText 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  unit?: string;
  secondaryText?: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="text-xl sm:text-2xl font-bold">
          {value}{unit ? ` ${unit}` : ''}
        </div>
        {secondaryText && (
          <div className="text-xs text-muted-foreground mt-1">
            {secondaryText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
