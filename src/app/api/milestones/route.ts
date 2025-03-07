import { NextRequest, NextResponse } from "next/server";
import prisma from "../prismaClient";
import { getUserPermission } from "@/lib/stackshare_utils";
import { Prisma } from "@prisma/client";

export async function GET() {
  const data = await prisma.milestone.findMany({
    orderBy: {
      date: "asc", // Use 'asc' for ascending, 'desc' for descending
    },
  });

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const isAllowed = await getUserPermission();
    if (!isAllowed) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 403 }
      );
    }
    const body = await request.json() as Prisma.MilestoneCreateInput;

    const newMilestone = await prisma.milestone.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
      },
    });

    // Return the newly created category
    return NextResponse.json(newMilestone, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating milestone:", error);
    return NextResponse.json(
      { error: "Failed to create milestone", details: error.message },
      { status: 500 }
    );
  }
}
