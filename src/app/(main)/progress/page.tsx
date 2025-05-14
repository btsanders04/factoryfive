"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createTask,
  createTaskSection,
  deleteTask,
  getAllTaskSections,
  updateTask,
} from "@/data/task";
import { TaskSectionWithRelations } from "@/lib/types/tasks";
import { Prisma, Task } from "@prisma/client";
import { PrimaryAddButton } from "@/components/PrimaryAddButton";
import CreateSectionModal from "./components/CreateSectionModal";
import { OverviewTab } from "./components/OverviewTab";
import { DetailedTab } from "./components/DetailedTab";

const AssemblyProgressTracker = () => {
  // State to track completed tasks
  const [taskSections, setTaskSections] = useState<TaskSectionWithRelations[]>(
    []
  );
  const [openModal, setOpenModal] = useState(false);
  // Add these state variables at the top of your component
  const [newTaskText, setNewTaskText] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState("overview");
  const [overallProgress, setOverallProgress] = useState(0);

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


  const handleCreateTransaction = async (
    data: Prisma.TaskSectionCreateInput
  ) => {
    const newSection = await createTaskSection(data);
    setTaskSections([...taskSections, newSection]);
  };

  useEffect(() => {
    const fetchTaskSections = async () => {
      const data = await getAllTaskSections();
      setTaskSections(data.taskSections);
      setOverallProgress(data.overallProgress);
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
          ></PrimaryAddButton>r
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed View</TabsTrigger>
            <TabsTrigger value="car">Car View</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab 
              taskSections={taskSections}
              calculateSectionProgress={calculateSectionProgress}
              overallProgress={overallProgress}
            />
          </TabsContent>

          <TabsContent value="details">
            <DetailedTab 
              taskSections={taskSections}
              calculateSectionProgress={calculateSectionProgress}
              toggleTask={toggleTask}
              onTrashClicked={onTrashClicked}
              newTaskText={newTaskText}
              updateNewTaskText={updateNewTaskText}
              addNewTask={addNewTask}
            />
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
