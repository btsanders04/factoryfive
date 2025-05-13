import { NextResponse } from 'next/server';
import prisma from '../prismaClient';

// Define the type for our statistics
type StatType = 'beersDrank' | 'cigarsSmoked' | 'lowesVisits' | 'hoursDriven';


// GET handler to retrieve all statistics
export async function GET() {
  try {
    // Use proper Prisma client to fetch all statistics
    const stats = await prisma.altStatistics.findMany();
    
    // Convert array of stats to an object for easier access
    const statsObject: Record<string, number> = {};
    stats.forEach((stat) => {
      statsObject[stat.type] = stat.count;
    });
    
    // Ensure all our stat types exist with at least 0 as value
    const defaultStats: Record<StatType, number> = {
      beersDrank: 0,
      cigarsSmoked: 0,
      lowesVisits: 0,
      hoursDriven: 0
    };
    
    return NextResponse.json({ 
      success: true, 
      data: { ...defaultStats, ...statsObject } 
    });
  } catch (error) {
    console.error('Error fetching alt statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

// POST handler to increment a statistic
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;
    
    if (!type || typeof type !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Type is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Find the existing statistic
    const existingStat = await prisma.altStatistics.findFirst({
      where: { type }
    });
    
    if (existingStat) {
      // Update existing statistic
      const newCount = existingStat.count + 1;
      const updatedStat = await prisma.altStatistics.update({
        where: { id: existingStat.id },
        data: { count: newCount }
      });
      
      return NextResponse.json({ 
        success: true, 
        data: updatedStat
      });
    } else {
      // Create new statistic with count 1
      const newStat = await prisma.altStatistics.create({
        data: {
          type,
          count: 1
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        data: newStat
      });
    }
  } catch (error) {
    console.error('Error incrementing statistic:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment statistic' },
      { status: 500 }
    );
  }
}

// PUT handler to update a statistic to a specific value
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { type, count } = body;
    
    if (!type || typeof type !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Type is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (count === undefined || typeof count !== 'number' || count < 0) {
      return NextResponse.json(
        { success: false, error: 'Count is required and must be a non-negative number' },
        { status: 400 }
      );
    }
    
    // Find the existing statistic
    const existingStat = await prisma.altStatistics.findFirst({
      where: { type }
    });
    
    let result;
    
    if (existingStat) {
      // Update existing statistic
      result = await prisma.altStatistics.update({
        where: { id: existingStat.id },
        data: { count }
      });
    } else {
      // Create new statistic with the specified count
      result = await prisma.altStatistics.create({
        data: {
          type,
          count
        }
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result
    });
  } catch (error) {
    console.error('Error updating statistic:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update statistic' },
      { status: 500 }
    );
  }
}
