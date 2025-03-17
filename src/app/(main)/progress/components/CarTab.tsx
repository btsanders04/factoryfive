"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TaskSectionWithRelations } from "@/lib/types/tasks";
import { ModelView } from "./ModelView";

interface CarTabProps {
  taskSections: TaskSectionWithRelations[];
  calculateOverallProgress: () => number;
}

export function CarTab({ taskSections, calculateOverallProgress }: CarTabProps) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold">Car Assembly Progress</h3>
          <span>{calculateOverallProgress().toFixed(0)}%</span>
        </div>
        <Progress value={calculateOverallProgress()} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive 3D Car Assembly View</CardTitle>
          <p className="text-sm text-muted-foreground">
            Click on different parts of the car to see build progress for each section
          </p>
        </CardHeader>
        <CardContent className="h-[600px]">
          <ModelView taskSections={taskSections} />
        </CardContent>
      </Card>
    </div>
  );
}