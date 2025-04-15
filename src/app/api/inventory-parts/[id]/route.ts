import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prismaClient";

/**
 * GET /api/inventory-parts/[id]
 * Retrieves a specific inventory part by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const inventoryPart = await prisma.inventoryPart.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            box: true
          }
        }
      }
    });

    if (!inventoryPart) {
      return NextResponse.json(
        { error: "Inventory part not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(inventoryPart, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching inventory part:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory part", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/inventory-parts/[id]
 * Updates a specific inventory part
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, we would check authentication here
    // For now, we'll skip authentication checks

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Get the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.quantityReceived && body.quantityReceived !== 0) {
      return NextResponse.json(
        { error: "quantityReceived is required" },
        { status: 400 }
      );
    }

    // Update the inventory part
    const updatedPart = await prisma.inventoryPart.update({
      where: { id },
      data: {
        quantityReceived: body.quantityReceived
      },
      include: {
        category: {
          include: {
            box: true
          }
        }
      }
    });

    return NextResponse.json(updatedPart, { status: 200 });
  } catch (error: any) {
    console.error("Error updating inventory part:", error);
    
    // Handle Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Inventory part not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update inventory part", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/inventory-parts/[id]
 * Deletes a specific inventory part
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, we would check admin authentication here
    // For now, we'll skip authentication checks

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Delete the inventory part
    await prisma.inventoryPart.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Inventory part deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting inventory part:", error);
    
    // Handle Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Inventory part not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete inventory part", details: error.message },
      { status: 500 }
    );
  }
}
