/* eslint-disable @typescript-eslint/no-explicit-any */


import { NextResponse } from "next/server";
import prisma from "../prismaClient";

/**
 * GET /api/inventory-parts
 * Retrieves all inventory parts with their related categories and boxes
 */
export async function GET() {
  try {
    // Fetch all inventory parts with their related categories and boxes
    const inventoryParts = await prisma.inventoryPart.findMany({
      include: {
        category: {
          include: {
            box: true
          }
        }
      },
      orderBy: {
        partNumber: 'asc'
      }
    });

    // Return the inventory parts as JSON
    return NextResponse.json(inventoryParts, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching inventory parts:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory parts", details: error.message },
      { status: 500 }
    );
  }
}
