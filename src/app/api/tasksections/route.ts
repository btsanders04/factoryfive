import {  NextRequest, NextResponse } from "next/server";
import prisma from "../prismaClient";
import { getUserPermission } from "@/lib/stackshare_utils";
import { Prisma } from "@prisma/client";

export async function GET() {
  const taskSections = await prisma.taskSection.findMany(
    {
        include: {
            tasks: true
        }
    }
  );

  // Calculate overall progress
  const totalTasks = taskSections.reduce(
    (acc, section) => acc + section.tasks.length,
    0
  );
  
  const totalCompleted = taskSections.flatMap((section) =>
    section.tasks.filter((task) => task.isCompleted)
  ).length;

  const overallProgress = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;

  // Calculate progress for each section
  const sectionsWithProgress = taskSections.map(section => {
    const completedCount = section.tasks.filter(task => task.isCompleted).length;
    const sectionProgress = section.tasks.length > 0 
      ? (completedCount / section.tasks.length) * 100 
      : 0;
      
    return {
      ...section,
      progress: sectionProgress
    };
  });

  return NextResponse.json({
    taskSections: sectionsWithProgress,
    overallProgress,
    totalTasks,
    completedTasks: totalCompleted
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
     const isAllowed = await getUserPermission();
      if (!isAllowed) {
          return NextResponse.json(
            {
              error:
                "Unauthorized",
            },
            { status: 403 }
          );
        }
    const body = await request.json() as Prisma.TaskSectionCreateInput;

      
    // Validate that required fields exist
    if (!body.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newTask = await prisma.taskSection.create({
      data: {
        name: body.name,
        description: body.description
      },
      include: {
        tasks: true
      }
    });

    return NextResponse.json(newTask, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create task", details: error.message },
      { status: 500 }
    );
  }
}