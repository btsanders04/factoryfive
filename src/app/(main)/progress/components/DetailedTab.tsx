"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskSectionWithRelations } from "@/lib/types/tasks";
import { Task } from "@prisma/client";

interface DetailedTabProps {
  taskSections: TaskSectionWithRelations[];
  calculateSectionProgress: (sectionIndex: number) => number;
  toggleTask: (task: Task) => Promise<void>;
  onTrashClicked: (taskId: number) => Promise<void>;
  newTaskText: Record<number, string>;
  updateNewTaskText: (id: number, text: string) => void;
  addNewTask: (sectionIndex: number, taskSectionId: number, name: string) => Promise<void>;
}

export function DetailedTab({
  taskSections,
  calculateSectionProgress,
  toggleTask,
  onTrashClicked,
  newTaskText,
  updateNewTaskText,
  addNewTask,
}: DetailedTabProps) {
  return (
    <div>
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
    </div>
  );
}