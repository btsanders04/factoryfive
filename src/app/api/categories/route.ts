import { getUserPermission } from "@/lib/stackshare_utils";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  const categories = await prisma.category.findMany();

  return NextResponse.json(categories, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
     const isAllowed = await getUserPermission();
      if (!isAllowed) {
          return NextResponse.json(
            {
              error:
                "Unauthorized",
            },
            { status: 403 }
          );
        }
    const body = await request.json();

    // Validate that the necessary fields are present
    if (!body.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Connect to the database
    const neon = new Pool({
      connectionString: process.env.POSTGRES_PRISMA_URL,
    });
    const adapter = new PrismaNeon(neon);
    const prisma = new PrismaClient({ adapter });

    // Create the new category
    const newCategory = await prisma.category.create({
      data: {
        name: body.name,
        description: body.description || null,
      },
      include: {
        transactions: true
      }
    });

    // Return the newly created category
    return NextResponse.json(newCategory, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category", details: error.message },
      { status: 500 }
    );
  }
}
