import { NextRequest, NextResponse } from 'next/server';
import prisma from '../prismaClient';
import { getUserPermission } from '@/lib/stackshare_utils';
import { BoxData } from '@/lib/types/inventory';

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

    console.log(`Processing ${boxData.length} boxes for inventory`);
    
    // Process each box in the data
    const processedBoxes = [];
    
    for (const box of boxData) {
      if (!box.box_number) {
        console.warn('Skipping box with no box number');
        continue;
      }

      try {
        // Find or create the box
        let boxRecord = await prisma.inventoryBox.findUnique({
          where: { boxNumber: box.box_number },
          include: { categories: true }
        });
        console.log(`Box Record ${boxRecord ? 'exists' : 'does not exist'}`);
        console.log(boxRecord);
        if (!boxRecord) {
          // Create new box
          boxRecord = await prisma.inventoryBox.create({
            data: {
              boxNumber: box.box_number,
            },
            include: { categories: true }
          });
          console.log(`Created new box: ${boxRecord.id}`);
        }

        // Process categories for this box
        if (box.categories && Array.isArray(box.categories)) {
          console.log(`Processing ${box.categories.length} categories for box ${box.box_number}`);
          for (const category of box.categories) {
            console.log(`Processing category ${category.category_name} for box ${box.box_number}`);
            if (category.category_name && category.category_number) {
              const categoryNumber = category.category_number;
              const categoryName = category.category_name;
              console.log(`Processing category ${categoryNumber} for box ${box.box_number}`);
              // Find or create the category
              let categoryRecord = await prisma.inventoryCategory.findFirst({
                where: { 
                  boxId: boxRecord.id,
                  categoryNumber: categoryNumber
                }
              });
              console.log(categoryRecord);
              console.log(`Category Record ${categoryRecord ? 'exists' : 'does not exist'}`);

              if (!categoryRecord) {
                // Create new category
                categoryRecord = await prisma.inventoryCategory.create({
                  data: {
                    categoryNumber: categoryNumber,
                    categoryName: categoryName,
                    boxId: boxRecord.id
                  }
                });
                console.log(`Created new category: ${categoryRecord.id}`);
              } else if (categoryRecord.categoryName !== categoryName) {
                // Update existing category if name changed
                categoryRecord = await prisma.inventoryCategory.update({
                  where: { id: categoryRecord.id },
                  data: { categoryName: categoryName }
                });
                console.log(`Updated category: ${categoryRecord.id}`);
              }
            }
          }
        }

        // Process parts for this box
        if (box.parts && Array.isArray(box.parts)) {
          for (const part of box.parts) {
            if (!part.part_number) {
              console.warn('Skipping part with no part number');
              continue;
            }

            const partNumber = part.part_number;
            const description = part.description || 'No description';
            const quantity = part.quantity || 1;
            const categoryNumber = part.category_number;

            // Find the category for this part if it has a category_number
            let partCategoryRecord = null;
            if (categoryNumber) {
              partCategoryRecord = await prisma.inventoryCategory.findFirst({
                where: { 
                  categoryNumber: categoryNumber
                }
              });
              console.log(`Part Category Record ${partCategoryRecord ? 'exists' : 'does not exist'}`);
            }

            // Find or create the part
            let partRecord = await prisma.inventoryPart.findFirst({
              where: { 
                partNumber: partNumber
              }
            });
            console.log(`Part Record ${partRecord ? 'exists' : 'does not exist'}`);

            if (!partRecord) {
              // Create new part
              partRecord = await prisma.inventoryPart.create({
                data: {
                  partNumber: partNumber,
                  description: description,
                  quantityExpected: quantity,
                  categoryId: partCategoryRecord ? partCategoryRecord.id : null,
                  boxId: boxRecord.id
                }
              });
              console.log(`Created new part: ${partRecord.id}`);
            } else if (partRecord.description !== description || 
                       partRecord.quantityExpected !== quantity || 
                       partRecord.categoryId !== (partCategoryRecord?.id || null) ||
                       partRecord.boxId !== boxRecord.id) {
              // Update existing part if description, quantity or category changed
              partRecord = await prisma.inventoryPart.update({
                where: { id: partRecord.id },
                data: {
                  description: description,
                  quantityExpected: quantity,
                  categoryId: partCategoryRecord?.id,
                  boxId: boxRecord.id
                }
              });
              console.log(`Updated part: ${partRecord.id}`);
            }
          }
        }

        // Add the processed box to the result
        const updatedBox = await prisma.inventoryBox.findUnique({
          where: { id: boxRecord.id },
          include: {
            categories: true,
            parts: true
          }
        });
        console.log(`Processed box: ${boxRecord.id}`);
        
        if (updatedBox) {
          console.log(`Adding processed box: ${updatedBox.id}`);
          processedBoxes.push(updatedBox);
        }
      } catch (boxError) {
        console.error(`Error processing box ${box.box_number}:`, boxError);
        // Continue with next box
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
