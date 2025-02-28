import { getUserPermission } from "@/lib/stackshare_utils";

import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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
  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  const adapter = new PrismaNeon(neon);
  const prisma = new PrismaClient({ adapter });
  const { name } = await request.json();

  const categoryId = parseInt((await params).id);
  const updatedCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: name,
    },
  });
  return NextResponse.json(updatedCategory, { status: 204 });
}
