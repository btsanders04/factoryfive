import { getUserPermission } from "@/lib/stackshare_utils";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  const tools = await prisma.tool.findMany();

  return NextResponse.json(tools, { status: 200 });
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
        { error: "Tool name is required" },
        { status: 400 }
      );
    }

    // Create the new category
    const newTool = await prisma.tool.create({
      data: {
        name: body.name,
        link: body.link || null,
      },
    });

    // Return the newly created tool
    return NextResponse.json(newTool, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating tool:", error);
    return NextResponse.json(
      { error: "Failed to create tool", details: error.message },
      { status: 500 }
    );
  }
}
