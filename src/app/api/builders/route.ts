import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL })
  const adapter = new PrismaNeon(neon)
  const prisma = new PrismaClient({ adapter })

  const builders = await prisma.builder.findMany()

  return NextResponse.json(builders, { status: 200 })
}