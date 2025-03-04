
import { NextResponse } from 'next/server';
import prisma from '../../prismaClient';


export async function GET() {

  const categories = await prisma.category.findMany({
    where: {
        Budget: null
    },
    include: {
        transactions: true
    }
  })

  return NextResponse.json(categories, { status: 200 })
}