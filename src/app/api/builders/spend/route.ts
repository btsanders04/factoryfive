import { NextResponse } from "next/server";
import prisma from "../../prismaClient";

export async function GET() {
  const builders = await prisma.builder.findMany({
    include: {
      transactions: true,
    },
  });

  const buildersSpend = builders.map((builder) => ({
    id: builder.id,
    name: builder.name,
    spend: builder.transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    ),
  }));

  return NextResponse.json(buildersSpend, { status: 200 });
}
