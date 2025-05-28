'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Wrench, Hammer, Car, Gauge, Award, Shell, CarFront, LifeBuoy, Weight } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { fetchPublicMetrics, type PublicMetrics } from '@/data/publicMetrics';

// Update item component for the latest updates section
type ColorScheme = 'blue' | 'indigo' | 'purple' | 'emerald' | 'amber';

interface UpdateItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
  colorScheme?: ColorScheme;
}

function UpdateItem({ icon, title, description, isLast = false, colorScheme = 'blue' }: UpdateItemProps) {
  const bgColorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
    amber: 'bg-amber-100 dark:bg-amber-900/30'
  };
  
  const textColorMap = {
    blue: 'text-blue-600 dark:text-blue-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    purple: 'text-purple-600 dark:text-purple-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400'
  };

  return (
    <div className={`flex items-start gap-3 ${!isLast ? 'pb-3 border-b border-gray-100 dark:border-gray-700' : ''}`}>
      <div className={`${bgColorMap[colorScheme]} p-2 rounded-full`}>
        <div className={`h-4 w-4 ${textColorMap[colorScheme]}`}>{icon}</div>
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

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

  // Latest updates data
  const latestUpdates = [
    {
      icon: <Weight />,
      title: "Cockpit Aluminum",
      description: "Cokpit and footbox aluminum siliconed and riveted into place",
      colorScheme: "emerald" as ColorScheme
    },
    {
      icon: <LifeBuoy />,
      title: "Steering Shaft",
      description: "Steering rods attached to steering column",
      colorScheme: "indigo" as ColorScheme
    },
    {
      icon: <CarFront />,
      title: "Pedal Box",
      description: "Clutch, Brake, and Throttle all installed with master cylinders attached",
      colorScheme: "purple" as ColorScheme
    },
    {
      icon: <Shell />,
      title: "IRS Assembly",
      description: "Completed rear suspension installation",
      colorScheme: "blue" as ColorScheme
    }
   
  ];

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
    <div className="space-y-8 px-4 py-6 max-w-7xl mx-auto">
      <div className="relative rounded-xl overflow-hidden text-white p-8 mb-12">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/images/background.JPEG')" }}></div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 py-8">
          <h1 className="text-5xl font-bold tracking-tight">Factory Five Mk5 Roadster Build</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Follow along with our journey building a Factory Five MK5 Roadster
          </p>
          <div className="w-24 h-1 bg-blue-400 rounded-full mt-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="col-span-full border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Gauge className="h-6 w-6 text-blue-600" />
              <span>Build Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm font-bold">{Math.round(metrics.taskProgress.overallProgress)}%</span>
              </div>
              <Progress value={Math.round(metrics.taskProgress.overallProgress)} className="h-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard 
                title="Hours Worked" 
                value={metrics.hoursWorked} 
                icon={<Clock className="text-blue-600" size={24} />}
                unit="hrs"
                color="blue"
              />
              <StatCard 
                title="Parts Installed" 
                value={metrics.partsInstalled} 
                icon={<Wrench className="text-indigo-600" size={24} />}
                secondaryText={`of ${metrics.totalParts} total parts`}
                color="indigo"
              />
              <StatCard 
                title="Tasks Completed" 
                value={metrics.taskProgress.completedTasks} 
                icon={<Award className="text-emerald-600" size={24} />}
                secondaryText={`of ${metrics.taskProgress.totalTasks} total tasks`}
                color="emerald"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-2 border-0 shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative h-64 md:h-auto cursor-pointer">
              <Link href="/public/buildlog" className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center justify-center transition-all hover:from-blue-600 hover:to-indigo-700">
                <Car className="h-24 w-24 text-white/90 mb-3" />
                <span className="text-white font-bold text-xl">Build Log</span>
              </Link>
            </div>
            <div className="md:w-1/2 p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Hammer className="h-5 w-5 text-blue-600" />
                  <span>About the Build</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-0 pb-0">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                My brother Jared, my dad Donnie, and I are bringing a dream to life—building a Factory Five MK5 Roadster, the ultimate modern tribute to the legendary 1965 Shelby Cobra.
This dashboard chronicles our family&apos;s journey as we transform boxes of parts into a hand-built, high-performance roadster. Two generations working side-by-side, we&apos;re documenting every triumph and challenge—from that first exciting unboxing to the heart-pounding moment we fire up the engine for the first time.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Follow along as we create more than just a car. We&apos;re building memories, sharing knowledge, and crafting our own piece of automotive history—one bolt at a time.
                </p>
              </CardContent>
            </div>
          </div>
        </Card>
        
        <Card className="col-span-full md:col-span-1 border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span>Latest Updates</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {latestUpdates.map((update, index) => (
                <UpdateItem
                  key={index}
                  icon={update.icon}
                  title={update.title}
                  description={update.description}
                  isLast={index === latestUpdates.length - 1}
                  colorScheme={update.colorScheme}
                />
              ))}
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
  secondaryText,
  color = 'blue'
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  unit?: string;
  secondaryText?: string;
  color?: 'blue' | 'indigo' | 'purple' | 'emerald';
}) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30',
    indigo: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800/30',
    purple: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/30',
    emerald: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800/30'
  };
  
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${colorClasses[color]} p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700 dark:text-gray-200">{title}</h3>
        <div>{icon}</div>
      </div>
      <div className="flex flex-col">
        <div className="text-3xl font-bold">
          {value.toLocaleString()}{unit ? ` ${unit}` : ''}
        </div>
        {secondaryText && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {secondaryText}
          </div>
        )}
      </div>
    </div>
  );
}
