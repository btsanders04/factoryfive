import { NextRequest, NextResponse } from 'next/server';

// For Node.js built-in fetch (Node 18+)
// If you use an older Node.js, you may need node-fetch

export const runtime = 'edge'; // Or 'nodejs' if you need Node APIs

// Define types for our results
interface BoxData {
  box_number?: string;
  categories?: Array<{
    category_name?: string;
    category_number?: string;
  }>;
  parts?: Array<{
    part_number?: string;
    category_number?: string;
    description?: string;
    quantity?: number;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    // Parse multipart/form-data
    const formData = await req.formData();
    
    // Get all files from the form data
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof File) {
        files.push(value);
      }
    }
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Prepare the prompt for Claude
    const prompt = `
The uploaded image(s) is a kit pack list from Factory Five Racing. Extract all parts information in a structured JSON array using the following format:

[
  {
    "box_number": "<box number>",
    "categories": [
      {
        "category_name": "<category name>",
        "category_number": "<category number>"
      }
    ],
    "parts": [
      {
        "part_number": "<part number>",
        "category_number": "<parent category number>",   
        "description": "<part description>",
        "quantity": <quantity as a number>
      }
    ]
  }
]

CRITICAL DETECTION INSTRUCTIONS:
- For Factory Five Racing kit lists, ONLY items that have a barcode but NO reference code (like BF0401, BB0801) in the middle column AND do not have a parent category should be treated as CATEGORIES
- All items with reference codes in the middle column are regular PARTS
- The category_number field for parts should be set to the part_number of their parent category
- If a part has no parent category, OMIT the category_number field entirely rather than including it as an empty string
- Each part belongs to the most recently defined category above it
- When a new page starts, parts at the top still belong to the most recently defined category from the previous page unless a new category is explicitly defined
- Parts at the top of a continuation page should be assigned to the category from the bottom of the previous page
- Use page numbers at bottom of images to determine sequence across multiple pages
- ONLY return the JSON array with no explanations or additional text.
    `;

    // Read all files as base64
    const imageContents = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');
        return {
          type: 'image' as const,
          source: {
            type: 'base64' as const,
            media_type: file.type,
            data: base64Image,
          },
        };
      })
    );
    
    // Prepare Claude API request with all images
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Claude API key not set' }, { status: 500 });
    }
    
    // Create the content array with the prompt text first, followed by all images
    const contentArray = [
      { type: 'text' as const, text: prompt },
      ...imageContents
    ];
    
    // Claude Vision API endpoint and payload
    const anthropicUrl = 'https://api.anthropic.com/v1/messages';
    const anthropicPayload = {
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 8000, // Increased token limit for multiple images
      messages: [
        {
          role: 'user',
          content: contentArray,
        },
      ],
    };
    
    // Make request to Claude API
    const response = await fetch(anthropicUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(anthropicPayload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Claude API error: ${response.status} ${errorText}` },
        { status: 500 }
      );
    }
    
    const result = await response.json();
    const content = result.content[0].text;
    
    // Parse the JSON response
    let parsedData: BoxData[] = [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        parsedData = parsed;
      } else {
        // If it's not an array but a valid object, wrap it in an array
        parsedData = [parsed];
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', content);
      return NextResponse.json(
        { error: 'Failed to parse Claude response as JSON: ' + parseError, rawContent: content },
        { status: 500 }
      );
    }
    
    // Return the results
    return NextResponse.json({
      results: parsedData,
      processed: files.length,
      successful: files.length,
      failed: []
    });
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
