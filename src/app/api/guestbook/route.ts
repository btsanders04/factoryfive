import { NextRequest, NextResponse } from "next/server";
import prisma from "../prismaClient";

/**
 * GET handler for fetching all guestbook entries
 */
export async function GET() {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      orderBy: {
        visitDate: "desc",
      },
    });
    
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch guestbook entries" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new guestbook entry
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    // Create the entry with current date if not provided
    const entry = await prisma.guestbookEntry.create({
      data: {
        name: body.name,
        message: body.message || null,
        visitDate: body.visitDate || new Date(),
      },
    });
    
    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error creating guestbook entry:", error);
    return NextResponse.json(
      { error: "Failed to create guestbook entry" },
      { status: 500 }
    );
  }
}
