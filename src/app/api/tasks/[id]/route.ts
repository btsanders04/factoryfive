import { getUserPermission } from "@/lib/stackshare_utils";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prismaClient";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAllowed = await getUserPermission();
  if (!isAllowed) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 403 }
    );
  }
  const { isCompleted } = await request.json();

  const taskId = parseInt((await params).id);
  console.log("Task Id", taskId);
  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      isCompleted: isCompleted,
      completionDate: isCompleted ? new Date() : null,
    },
  });
  return NextResponse.json(updatedTask, { status: 202 });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAllowed = await getUserPermission();
  if (!isAllowed) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 403 }
    );
  }

  const taskId = parseInt((await params).id);
  const updatedTask = await prisma.task.delete({
    where: {
      id: taskId,
    }
  });
  return NextResponse.json(updatedTask, { status: 200 });
}

