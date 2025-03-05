import { getUserPermission } from "@/lib/stackshare_utils";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prismaClient";
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
  const { amount, categoryId, builderId, notes, date, relatedTransactionId } = await request.json();
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
      relatedTransactionId
    },
    include: {
      category: true,
      builder: true,
    },
  });
  return NextResponse.json(transaction, { status: 202 });
}
