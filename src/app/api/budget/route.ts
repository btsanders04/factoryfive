
import { NextResponse } from "next/server";
import prisma from "../prismaClient";

export async function GET() {

  // Get a budget with its category and related transactions
  const budgetWithTransactions = await prisma.budget.findMany({
    include: {
      category: {
        include: {
          transactions: {
            include: {
                builder: true
            }
          }
        },
      },
    },
  });

  return NextResponse.json(budgetWithTransactions, { status: 200 });
}
