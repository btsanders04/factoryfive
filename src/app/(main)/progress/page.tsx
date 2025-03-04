"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import {
  createTask,
  createTaskSection,
  deleteTask,
  getAllTaskSections,
  updateTask,
} from "./task.service";
import { TaskSectionWithRelations } from "@/lib/types/tasks";
import { Prisma, Task } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PrimaryAddButton } from "@/components/PrimaryAddButton";
import CreateSectionModal from "./CreateSectionModal";

const AssemblyProgressTracker = () => {
  // State to track completed tasks
  const [taskSections, setTaskSections] = useState<TaskSectionWithRelations[]>(
    []
  );
  const [openModal, setOpenModal] = useState(false);
  // Add these state variables at the top of your component
  const [newTaskText, setNewTaskText] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState("overview");

  // Function to toggle task completion
  const toggleTask = async (task: Task) => {
    const updatedTask = await updateTask({
      id: task.id,
      isCompleted: !task.isCompleted,
    });
    setTaskSections(
      taskSections.map((taskSection) => ({
        ...taskSection,
        tasks: taskSection.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ),
      }))
    );
  };

  const onTrashClicked = async (taskId: number) => {
    await deleteTask(taskId);
    setTaskSections(
      taskSections.map((section) => ({
        ...section,
        tasks: section.tasks.filter((task) => task.id !== taskId),
      }))
    );
  };

  const updateNewTaskText = (id: number, text: string) => {
    setNewTaskText({ ...newTaskText, [id]: text });
  };

  // Add this function to handle adding new tasks
  const addNewTask = async (
    sectionIndex: number,
    taskSectionId: number,
    name: string
  ) => {
    const newTask = await createTask({ name, taskSectionId });
    const updatedSections = [...taskSections];
    updatedSections[sectionIndex].tasks.push(newTask);
    setTaskSections(updatedSections);
    updateNewTaskText(taskSectionId, "");
  };

  // Calculate progress for a section
  const calculateSectionProgress = (sectionIndex: number) => {
    const section = taskSections[sectionIndex];
    const completedCount = section.tasks.filter(
      (task) => task.isCompleted
    ).length;
    if (section.tasks.length === 0) {
      return 0;
    }
    return (completedCount / section.tasks.length) * 100;
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalTasks = taskSections.reduce(
      (acc, section) => acc + section.tasks.length,
      0
    );
    if (totalTasks === 0) {
      return 0;
    }
    const totalCompleted = taskSections.flatMap((section) =>
      section.tasks.filter((task) => task.isCompleted)
    ).length;

    return (totalCompleted / totalTasks) * 100;
  };

  const handleCreateTransaction = async (
    data: Prisma.TaskSectionCreateInput
  ) => {
    const newSection = await createTaskSection(data);
    setTaskSections([...taskSections, newSection]);
  };

  useEffect(() => {
    const fetchTaskSections = async () => {
      const data = await getAllTaskSections();
      setTaskSections(data);
    };
    fetchTaskSections();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Overall Progress</h1>
            <p className="text-gray-500">Are we done yet?</p>
          </div>
          <PrimaryAddButton
            buttonTitle="Add New Section"
            onClick={() => setOpenModal(true)}
          ></PrimaryAddButton>
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
          </TabsContent>

          <TabsContent value="details">
            {taskSections.map((section, sectionIndex) => {
              const progress = calculateSectionProgress(sectionIndex);

              return (
                <div key={section.id} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {progress === 100 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                      {section.name}
                    </h3>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 mb-3" />

                  <div className="ml-6 mt-3 space-y-2">
                    {section.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start justify-between"
                      >
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id={`task-${section.id}-${task.id}`}
                            checked={task.isCompleted}
                            onCheckedChange={() => toggleTask(task)}
                          />
                          <Label
                            htmlFor={`task-${section.id}-${task.id}`}
                            className={`text-sm ${task.isCompleted ? "line-through text-gray-400" : ""}`}
                          >
                            {task.name}
                          </Label>
                        </div>
                        <button
                          onClick={() => onTrashClicked(task.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                          aria-label="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {/* New task input section */}
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        id={`new-task-${section.id}`}
                        placeholder="Add new task..."
                        value={newTaskText[section.id] ?? ""}
                        onChange={(e) =>
                          updateNewTaskText(section.id, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            newTaskText[section.id]?.trim()
                          ) {
                            addNewTask(
                              sectionIndex,
                              section.id,
                              newTaskText[section.id]?.trim()
                            );
                          }
                        }}
                        className="text-sm h-8"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (newTaskText[section.id]?.trim()) {
                            addNewTask(
                              sectionIndex,
                              section.id,
                              newTaskText[section.id]?.trim()
                            );
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
      {openModal && (
        <CreateSectionModal
          open={openModal}
          onOpenChange={setOpenModal}
          onSubmit={handleCreateTransaction}
        ></CreateSectionModal>
      )}
    </div>
  );
};

export default AssemblyProgressTracker;
