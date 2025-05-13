'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface StatsRadarChartProps {
  beersDrank: number;
  cigarsSmoked: number;
  lowesVisits: number;
  hoursDriven: number;
  hoursWorked: number;
}

export function StatsRadarChart({
  beersDrank,
  cigarsSmoked,
  lowesVisits,
  hoursDriven,
  hoursWorked,
}: StatsRadarChartProps) {
  // Normalize the data for better visualization
  // This ensures all values are on a similar scale for the radar chart
  const maxValue = Math.max(beersDrank, cigarsSmoked, lowesVisits, hoursDriven, hoursWorked);
  const normalizer = maxValue > 0 ? 100 / maxValue : 1;

  const data = [
    {
      subject: 'Beers',
      value: beersDrank,
      normalizedValue: beersDrank * normalizer,
      fullMark: 100,
    },
    {
      subject: 'Cigars',
      value: cigarsSmoked,
      normalizedValue: cigarsSmoked * normalizer,
      fullMark: 100,
    },
    {
      subject: 'Lowes',
      value: lowesVisits,
      normalizedValue: lowesVisits * normalizer,
      fullMark: 100,
    },
    {
      subject: 'Driving',
      value: hoursDriven,
      normalizedValue: hoursDriven * normalizer,
      fullMark: 100,
    },
    {
      subject: 'Work',
      value: hoursWorked,
      normalizedValue: hoursWorked * normalizer,
      fullMark: 100,
    },
  ];

  // Custom tooltip to show the actual values
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{`${payload[0].payload.subject}: ${payload[0].payload.value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Stats Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="hsl(var(--muted-foreground) / 0.3)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <Radar
                name="Stats"
                dataKey="normalizedValue"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.3)"
                fillOpacity={0.6}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
