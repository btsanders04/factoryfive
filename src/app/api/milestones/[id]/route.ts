import prisma from "@/app/api/prismaClient";
import { getUserPermission } from "@/lib/stackshare_utils";
import { Milestone, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAllowed = await getUserPermission();
  const id = parseInt((await params).id);
  if (!isAllowed) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 403 }
    );
  }

  try {
    // Parse the request body
    const { featuredImage, additionalImages, title, description, date } =
      (await request.json()) as Prisma.MilestoneUpdateInput;

    let updatedMilestone: Milestone | null = null;
    const data = {
      ...(featuredImage && { featuredImage }),
      ...(additionalImages && { additionalImages }),
      ...(title && { title }),
      ...(description && { description }),
      ...(date && { date }),
    };
    updatedMilestone = await prisma.milestone.update({
      where: {
        id: id,
      },
      data: data,
    });
    return NextResponse.json(updatedMilestone);
  } catch (error) {
    console.error("Error updating milestone:", error);
    return NextResponse.json(
      { error: "Failed to process milestone request" },
      { status: 500 }
    );
  }
}
