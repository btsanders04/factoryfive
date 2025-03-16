"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getPartsMetrics } from "@/data/partsinventory";

interface PartsMetrics {
  totalParts: number;
  receivedParts: number;
  installedParts: number;
  receivedPercentage: number;
  installedPercentage: number;
}

export function PartsCard() {
  const [metrics, setMetrics] = useState<PartsMetrics>({
    totalParts: 0,
    receivedParts: 0,
    installedParts: 0,
    receivedPercentage: 0,
    installedPercentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getPartsMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching parts metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <Card className="shadow-md w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Parts Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Total Parts</p>
              <span className="text-2xl font-bold">{metrics.totalParts}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">Parts Received</p>
              <span className="text-sm font-medium text-muted-foreground">
                {metrics.receivedParts} / {metrics.totalParts}
              </span>
            </div>
            <Progress value={metrics.receivedPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.receivedPercentage}% complete
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">Parts Installed</p>
              <span className="text-sm font-medium text-muted-foreground">
                {metrics.installedParts} / {metrics.totalParts}
              </span>
            </div>
            <Progress value={metrics.installedPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.installedPercentage}% complete
            </p>
          </div>

          {/* Link to parts page */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link 
              href="/parts" 
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline block"
            >
              View all parts →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 