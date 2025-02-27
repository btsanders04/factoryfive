import { getUserPermission } from "@/lib/stackshare_utils";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  const isAllowed = await getUserPermission('write_transactions');
  console.log(isAllowed);
  if (!isAllowed) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        { status: 403 }
      );
    }
  try {
    // Parse the request body
    const { amount, date, categoryId, notes, description, builderId } =
      await request.json();

    // Input validation
    if (!amount || !date || !builderId || !categoryId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: amount, date, category_id, and user_id are required",
        },
        { status: 400 }
      );
    }

    // Create the transaction using Prisma
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        date: new Date(date),
        description,
        notes,
        category: {
          connect: { id: categoryId },
        },
        builder: {
          connect: { id: builderId },
        },
      },
      include: {
        category: true,
        builder: true,
      },
    });

    return NextResponse.json(transaction, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    include: {
      builder: true,
      category: true,
    },
  });
  return NextResponse.json(transactions, { status: 200 });
}
