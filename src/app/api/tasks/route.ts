import { NextResponse } from "next/server";
import prisma from "../prismaClient";



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