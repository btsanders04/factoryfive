import { NextResponse } from "next/server";
import prisma from "../prismaClient";

/**
 * GET /api/partsinventory
 * Retrieves all parts inventory items
 */
export async function GET() {
  try {
    // Fetch all parts inventory items from the database
    const partsInventory = await prisma.partsInventory.findMany();

    // Return the parts inventory items as JSON
    return NextResponse.json(partsInventory, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching parts inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch parts inventory", details: error.message },
      { status: 500 }
    );
  }
} 