import { getUserPermission } from "@/lib/stackshare_utils";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../prismaClient";

export async function GET() {
  const workHours = await prisma.workHour.findMany();
  return NextResponse.json(workHours, { status: 200 });
}

export async function PUT(request: NextRequest) {
  try {
    const isAllowed = await getUserPermission();
    if (!isAllowed) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 403 }
      );
    }
    const { date, hours } = await request.json();
    // Validate required fields
    if (!date || hours === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: date and hours are required" },
        { status: 400 }
      );
    }
    const workhour = await prisma.workHour.upsert({
      where: {
        date: new Date(date),
      },
      update: {
        hours: Number(hours),
      },
      create: {
        date: new Date(date),
        hours: Number(hours),
      },
    });
    return NextResponse.json(workhour, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Server error", message: error }, { status: 500 });
  }
}
