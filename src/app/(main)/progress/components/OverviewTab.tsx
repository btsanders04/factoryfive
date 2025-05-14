"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TaskSectionWithRelations } from "@/lib/types/tasks";

interface OverviewTabProps {
  taskSections: TaskSectionWithRelations[];
  calculateSectionProgress: (sectionIndex: number) => number;
  overallProgress: number;
}

export function OverviewTab({ 
  taskSections, 
  calculateSectionProgress, 
  overallProgress 
}: OverviewTabProps) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold">Overall Progress</h3>
          <span>{overallProgress.toFixed(0)}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {taskSections.map((section, sectionIndex) => {
          const progress = calculateSectionProgress(sectionIndex);

          return (
            <Card key={sectionIndex} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-medium">
                  {section.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="relative pt-8 pb-2">
                  <svg
                    className="w-24 h-24 mx-auto"
                    viewBox="0 0 100 100"
                  >
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    {progress > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray={`${40 * 2 * Math.PI * (progress / 100)} ${40 * 2 * Math.PI * (1 - progress / 100)}`}
                        strokeDashoffset={40 * 2 * Math.PI * 0.25}
                        transform="rotate(-90 50 50)"
                      />
                    )}
                    {/* Percentage text */}
                    <text
                      x="50"
                      y="50"
                      fontSize="16"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#1e293b"
                      fontWeight="bold"
                    >
                      {progress.toFixed(0)}%
                    </text>
                  </svg>
                  <div className="text-center mt-2">
                    <span className="text-sm text-gray-500">
                      {
                        section.tasks.filter((task) => task.isCompleted)
                          .length
                      }{" "}
                      of {section.tasks.length} tasks
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}