import { NextRequest, NextResponse } from 'next/server';
import prisma from '../prismaClient';
import { getUserPermission } from '@/lib/stackshare_utils';

interface PartData {
  part_number?: string;
  description?: string;
  quantity?: number;
}

interface CategoryData {
  category_name?: string;
  category_number?: string;
  parts?: PartData[];
}

interface BoxData {
  box_number?: string;
  categories?: CategoryData[];
}

// No longer using ResultData interface, accepting BoxData[] directly

// GET endpoint to fetch inventory data
export async function GET() {
  try {
    // Fetch all boxes with their related categories and parts
    const boxes = await prisma.inventoryBox.findMany({
      include: {
        categories: {
          include: {
            parts: true
          }
        }
      },
      orderBy: {
        boxNumber: 'asc'
      }
    });

    return NextResponse.json(boxes, { status: 200 });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory data' },
      { status: 500 }
    );
  }
}

// POST endpoint to process inventory data
export async function POST(req: NextRequest) {
  try {
    // Check user permission
    const isAllowed = await getUserPermission();
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Parse the request body
    const boxData = await req.json() as BoxData[];
    
    // Validate the data format
    if (!Array.isArray(boxData)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array of box data.' },
        { status: 400 }
      );
    }

    // Log the received data for debugging
    console.log(`Processing ${boxData.length} boxes for inventory`);
    
    // Process each box in the data
    const processedBoxes = [];
    
    for (const box of boxData) {
      if (!box.box_number) {
        console.warn('Skipping box with no box number');
        continue;
      }

      // Find or create the box
      let boxRecord = await prisma.inventoryBox.findUnique({
        where: { boxNumber: box.box_number },
        include: { categories: true }
      });

      if (!boxRecord) {
        // Create new box
        boxRecord = await prisma.inventoryBox.create({
          data: {
            boxNumber: box.box_number,
          },
          include: { categories: true }
        });
      }

      // Process categories for this box
      if (box.categories && Array.isArray(box.categories)) {
        for (const category of box.categories) {
          if (!category.category_name && !category.category_number) {
            console.warn('Skipping category with no name or number');
            continue;
          }

          const categoryNumber = category.category_number || 'unknown';
          const categoryName = category.category_name || 'Unnamed Category';

          // Find or create the category
          let categoryRecord = await prisma.inventoryCategory.findFirst({
            where: { 
              boxId: boxRecord.id,
              categoryNumber: categoryNumber
            },
            include: { parts: true }
          });

          if (!categoryRecord) {
            // Create new category
            categoryRecord = await prisma.inventoryCategory.create({
              data: {
                categoryNumber: categoryNumber,
                categoryName: categoryName,
                boxId: boxRecord.id
              },
              include: { parts: true }
            });
          } else {
            // Update existing category if name changed
            if (categoryRecord.categoryName !== categoryName) {
              categoryRecord = await prisma.inventoryCategory.update({
                where: { id: categoryRecord.id },
                data: { categoryName: categoryName },
                include: { parts: true }
              });
            }
          }

          // Process parts for this category
          if (category.parts && Array.isArray(category.parts)) {
            for (const part of category.parts) {
              if (!part.part_number) {
                console.warn('Skipping part with no part number');
                continue;
              }

              const partNumber = part.part_number;
              const description = part.description || 'No description';
              const quantity = part.quantity || 1;

              // Find or create the part
              let partRecord = await prisma.inventoryPart.findFirst({
                where: {
                  categoryId: categoryRecord.id,
                  partNumber: partNumber
                }
              });

              if (!partRecord) {
                // Create new part
                partRecord = await prisma.inventoryPart.create({
                  data: {
                    partNumber: partNumber,
                    description: description,
                    quantityExpected: quantity,
                    categoryId: categoryRecord.id
                  }
                });
              } else {
                // Update existing part if description or quantity changed
                if (partRecord.description !== description || partRecord.quantityExpected !== quantity) {
                  partRecord = await prisma.inventoryPart.update({
                    where: { id: partRecord.id },
                    data: {
                      description: description,
                      quantityExpected: quantity
                    }
                  });
                }
              }
            }
          }
        }
      }

      // Add the processed box to the result
      const updatedBox = await prisma.inventoryBox.findUnique({
        where: { id: boxRecord.id },
        include: {
          categories: {
            include: {
              parts: true
            }
          }
        }
      });
      
      if (updatedBox) {
        processedBoxes.push(updatedBox);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Processed ${processedBoxes.length} boxes`,
      data: processedBoxes 
    });
  } catch (error) {
    console.error('Error processing inventory data:', error);
    return NextResponse.json(
      { success: false, error: `Failed to process inventory data: ${error}` },
      { status: 500 }
    );
  }
}

// Implementation complete! The API now:
// 1. Accepts an array of BoxData objects
// 2. Creates or updates boxes, categories, and parts in the database
// 3. Returns the processed data with database IDs
