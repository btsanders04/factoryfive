import { getUserPermission } from "@/lib/stackshare_utils";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAllowed = await getUserPermission();
  if (!isAllowed) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 403 }
    );
  }
  const id = parseInt((await params).id);
  const transaction = await prisma.transaction.delete({
    where: {
      id: id,
    },
  });
  return NextResponse.json(transaction, { status: 202 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAllowed = await getUserPermission();
  if (!isAllowed) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 403 }
    );
  }
  const id = parseInt((await params).id);
  const { amount, categoryId, builderId, notes, date } = await request.json();
  const transaction = await prisma.transaction.update({
    where: {
      id: id,
    },
    data: {
      amount,
      categoryId,
      builderId,
      notes,
      date,
    },
    include: {
      category: true,
      builder: true,
    },
  });
  return NextResponse.json(transaction, { status: 202 });
}
