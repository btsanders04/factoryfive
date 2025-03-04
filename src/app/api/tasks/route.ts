import { NextRequest, NextResponse } from "next/server";
import prisma from "../prismaClient";
import { getUserPermission } from "@/lib/stackshare_utils";
import { Prisma } from "@prisma/client";



export async function GET() {
  const tasks = await prisma.task.findMany(
    {
        include: {
            taskSection: true
        }
    }
  );

  return NextResponse.json(tasks, { status: 200 });
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
    const body = await request.json() as Prisma.TaskUncheckedCreateInput;

      
    // Validate that required fields exist
    if (!body.name || !body.taskSectionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newTask = await prisma.task.create({
      data: {
        name: body.name,
        taskSectionId: body.taskSectionId
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