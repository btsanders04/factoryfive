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
  const tool = await prisma.tool.delete({
    where: {
      id: id,
    },
  });
  return NextResponse.json(tool, { status: 202 });
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
  const { aquired } = await request.json();

  const id = parseInt((await params).id);
  const tool = await prisma.tool.update({
    where: {
      id: id,
    },
    data: {
      aquired: !!aquired,
    },
  });
  return NextResponse.json(tool, { status: 202 });
}
