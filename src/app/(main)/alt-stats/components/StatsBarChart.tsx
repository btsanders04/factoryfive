'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface StatsBarChartProps {
  beersDrank: number;
  cigarsSmoked: number;
  lowesVisits: number;
  hoursDriven: number;
  hoursWorked: number;
}

export function StatsBarChart({
  beersDrank,
  cigarsSmoked,
  lowesVisits,
  hoursDriven,
  hoursWorked,
}: StatsBarChartProps) {
  // Calculate ratios per hour worked
  // Avoid division by zero
  const safeHoursWorked = hoursWorked > 0 ? hoursWorked : 1;
  
  const beersPerHour = (beersDrank / safeHoursWorked).toFixed(3);
  const cigarsPerHour = (cigarsSmoked / safeHoursWorked).toFixed(3);
  const lowesVisitsPerHour = (lowesVisits / safeHoursWorked).toFixed(3);
  const drivingRatio = (hoursDriven / safeHoursWorked).toFixed(3);
  
  const data = [
    {
      name: 'Beers',
      ratio: parseFloat(beersPerHour),
      description: 'Beers per Hour Worked',
    },
    {
      name: 'Cigars',
      ratio: parseFloat(cigarsPerHour),
      description: 'Cigars per Hour Worked',
    },
    {
      name: 'Lowes',
      ratio: parseFloat(lowesVisitsPerHour),
      description: 'Lowes Visits per Hour Worked',
    },
    {
      name: 'Driving',
      ratio: parseFloat(drivingRatio),
      description: 'Driving Hours per Hour Worked',
    },
  ];

  // Custom tooltip to show more detailed information
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{item.description}</p>
          <p className="text-lg font-bold">{item.ratio.toFixed(3)}</p>
          <div className="text-sm text-muted-foreground mt-1">
            <p>Total: {item.name === 'Beers' ? beersDrank : 
                       item.name === 'Cigars' ? cigarsSmoked : 
                       item.name === 'Lowes' ? lowesVisits : 
                       hoursDriven}</p>
            <p>Hours Worked: {hoursWorked}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Stats per Hour Worked</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="ratio" 
                name="Ratio per Hour Worked" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
