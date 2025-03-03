/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Circle } from "lucide-react";

const AssemblyProgressTracker = () => {
  // Assembly steps data
  const assemblySteps = [
    {
      section: "Initial Preparation",
      tasks: [
        "Unpacking the kit",
        "Kit parts preparation",
        "Body and aluminum panel removal",
        "Chassis positioning for work",
      ],
    },
    {
      section: "Chassis Assembly",
      tasks: [
        "Engine bay F-panel aluminum",
        "Front suspension",
        "Front brakes",
        "IRS (Independent Rear Suspension)",
        "Firewall & driver front footbox aluminum",
      ],
    },
    {
      section: "Controls & Steering",
      tasks: [
        "Pedal box assembly",
        "Accelerator pedal",
        "Steering rack",
        "Steering shaft assembly",
      ],
    },
    {
      section: "Cockpit & Interior Structure",
      tasks: [
        "Cockpit aluminum panels",
        "Passenger footbox",
        "Floor panels",
        "Transmission tunnel",
        "Trunk aluminum",
      ],
    },
    {
      section: "Fuel System",
      tasks: [
        "Frame preparation",
        "Fuel tank installation",
        "Fuel pick-up & sender",
        "Fuel filler neck",
        "Fuel lines & filter",
      ],
    },
    {
      section: "Brake System",
      tasks: [
        "Brake reservoirs",
        "Brake lines",
        "Brake fluid filling/bleeding",
        "Pedal adjustment",
      ],
    },
    {
      section: "Drivetrain Installation",
      tasks: [
        "Engine preparation",
        "Transmission preparation",
        "Engine/transmission installation",
        "Battery mounting",
        "Headers & exhaust",
      ],
    },
    {
      section: "Cooling System",
      tasks: [
        "Fan mounting",
        "Radiator mounting",
        "Radiator hoses",
        "Overflow tank",
      ],
    },
    {
      section: "Electrical System",
      tasks: [
        "Chassis wiring harness",
        "Speedometer sending unit",
        "Engine wiring",
      ],
    },
    {
      section: "Additional Mechanical Components",
      tasks: ["Emergency brake", "Driveshaft", "Axle and fuel tank vents"],
    },
    {
      section: "Interior Components",
      tasks: [
        "Transmission tunnel cover",
        "Seats",
        "Gauges and dash",
        "Steering wheel",
        "Rollbar",
      ],
    },
    {
      section: "Body Preparation & Mounting",
      tasks: [
        "Frame preparation",
        "Body fitment",
        "Hood installation and fitment",
        "Hood scoop",
        "Windshield installation",
      ],
    },
    {
      section: "Exterior Components",
      tasks: [
        "Door installation and fitment",
        "Door latches",
        "Trunk installation and fitment",
        "Side mirrors",
        "Body stripes/centerline",
      ],
    },
    {
      section: "Body Cut-outs & Accessories",
      tasks: [
        "Fuel filler",
        "Headlights",
        "Tail lights",
        "Turn signals",
        "License plate light",
        "Side exhaust",
        "Side louvers",
        "Roll bar cut-outs",
      ],
    },
    {
      section: "Final Assembly",
      tasks: [
        "Carpet installation",
        "Seat harnesses",
        "Emergency brake boot",
        "Shifter handle and boot",
        "Headlight adjustment",
        "Aluminum splash guards",
        "Final checks and adjustments",
      ],
    },
    {
      section: "Testing & Alignment",
      tasks: [
        "Headlight alignment",
        "Wheel alignment",
        "Final fluid checks",
        "Mechanical systems testing",
      ],
    },
  ];

  // State to track completed tasks
  const [completedTasks, setCompletedTasks] = useState<any>({});
  const [activeTab, setActiveTab] = useState("overview");

  // Function to toggle task completion
  const toggleTask = (sectionIndex: number, taskIndex: number) => {
    setCompletedTasks((prev: { [x: string]: any }) => {
      const key = `${sectionIndex}-${taskIndex}`;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  // Calculate progress for a section
  const calculateSectionProgress = (sectionIndex: number) => {
    const section = assemblySteps[sectionIndex];
    const completedCount = section.tasks.filter(
      (_, taskIndex) => completedTasks[`${sectionIndex}-${taskIndex}`]
    ).length;

    return (completedCount / section.tasks.length) * 100;
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalTasks = assemblySteps.reduce(
      (acc, section) => acc + section.tasks.length,
      0
    );
    const totalCompleted = Object.values(completedTasks).filter(Boolean).length;

    return (totalCompleted / totalTasks) * 100;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Overall Progress</h1>
            <p className="text-gray-500">Are we done yet?</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed View</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">Overall Progress</h3>
                <span>{calculateOverallProgress().toFixed(0)}%</span>
              </div>
              <Progress value={calculateOverallProgress()} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assemblySteps.map((section, sectionIndex) => {
                const progress = calculateSectionProgress(sectionIndex);

                return (
                  <Card key={sectionIndex} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-medium">
                        {section.section}
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
                              section.tasks.filter(
                                (_, taskIndex) =>
                                  completedTasks[`${sectionIndex}-${taskIndex}`]
                              ).length
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
          </TabsContent>

          <TabsContent value="details">
              {assemblySteps.map((section, sectionIndex) => {
                const progress = calculateSectionProgress(sectionIndex);

                return (
                  <div key={sectionIndex} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {progress === 100 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                        {section.section}
                      </h3>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 mb-3" />

                    <div className="ml-6 mt-3 space-y-2">
                      {section.tasks.map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className="flex items-start space-x-2"
                        >
                          <Checkbox
                            id={`task-${sectionIndex}-${taskIndex}`}
                            checked={
                              !!completedTasks[`${sectionIndex}-${taskIndex}`]
                            }
                            onCheckedChange={() =>
                              toggleTask(sectionIndex, taskIndex)
                            }
                          />
                          <Label
                            htmlFor={`task-${sectionIndex}-${taskIndex}`}
                            className={`text-sm ${completedTasks[`${sectionIndex}-${taskIndex}`] ? "line-through text-gray-400" : ""}`}
                          >
                            {task}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssemblyProgressTracker;
