import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL })
  const adapter = new PrismaNeon(neon)
  const prisma = new PrismaClient({ adapter })

  const categories = await prisma.category.findMany()

  return NextResponse.json(categories, { status: 200 })
  //  try {
  //   const categories = await prisma.category.findMany();
  //   return Response.json({ categories });
  // } catch (error) {
  //   console.error('Database query failed:', error);
  //   return Response.json(
  //     { error: 'Failed to fetch categories', details: error.message },
  //     { status: 500 }
  //   );
  // }
}