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
    const { featuredImage, additionalImages } =
      (await request.json()) as Prisma.MilestoneUpdateInput;

    let updatedMilestone: Milestone | null = null;
    // If amount is 0, delete the budget if it exists
    if (featuredImage) {
      // Check if budget exists
      updatedMilestone = await prisma.milestone.update({
        where: {
          id: id,
        },
        data: {
          featuredImage: featuredImage,
        },
      });
    } else if (additionalImages) {
      // Check if a budget already exists
      updatedMilestone = await prisma.milestone.update({
        where: {
          id: id,
        },
        data: {
          additionalImages: additionalImages,
        },
      });
    }
    if (updatedMilestone) {
      return NextResponse.json(updatedMilestone);
    } else {
      return NextResponse.json(
        {
          error: "Nothing to update",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating milestone:", error);
    return NextResponse.json(
      { error: "Failed to process milestone request" },
      { status: 500 }
    );
  }
}
