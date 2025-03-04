
import { NextResponse } from 'next/server';
import prisma from '../prismaClient';

export async function GET() {
  const builders = await prisma.builder.findMany()

  return NextResponse.json(builders, { status: 200 })
}