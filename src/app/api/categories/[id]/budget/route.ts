import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request : NextRequest, context: any) {
  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  const adapter = new PrismaNeon(neon);
  const prisma = new PrismaClient({ adapter });

  try {
    // Parse the request body
    const { amount } = await request.json();
    const categoryId = parseInt(context.params.id); // Validate inputs
    if (categoryId === undefined) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    if (amount === undefined) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Handle budget management based on amount
    let result;

    // If amount is 0, delete the budget if it exists
    if (amount === 0) {
      // Check if budget exists
      const existingBudget = await prisma.budget.findUnique({
        where: {
          categoryId: categoryId,
        },
        include: {
          category: {
            include: {
              transactions: true,
            },
          },
        },
      });

      if (existingBudget) {
        // Delete the budget
        await prisma.budget.delete({
          where: {
            id: existingBudget.id,
          },
        });
        result = {
          message: `Budget for category ${category.name} has been deleted.`,
          budget: existingBudget,
          action: "DELETED",
        };
      } else {
        result = {
          message: `No budget exists for category ${category.name}.`,
        };
      }
    } else {
      // Check if a budget already exists
      const existingBudget = await prisma.budget.findUnique({
        where: {
          categoryId: categoryId,
        },
      });

      if (existingBudget) {
        // Update existing budget
        const updatedBudget = await prisma.budget.update({
          where: {
            id: existingBudget.id,
          },
          data: {
            amount: amount,
          },
          include: {
            category: {
              include: {
                transactions: true,
              },
            },
          },
        });
        result = {
          message: `Budget for category ${category.name} updated to ${amount}.`,
          budget: updatedBudget,
          action: "UPDATED",
        };
      } else {
        // Create new budget
        const newBudget = await prisma.budget.create({
          data: {
            amount: amount,
            categoryId: categoryId,
          },
          include: {
            category: {
              include: {
                transactions: true,
              },
            },
          },
        });
        result = {
          message: `New budget created for category ${category.name} with amount ${amount}.`,
          budget: newBudget,
          action: "CREATED",
        };
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error managing budget:", error);
    return NextResponse.json(
      { error: "Failed to process budget request" },
      { status: 500 }
    );
  }
}
