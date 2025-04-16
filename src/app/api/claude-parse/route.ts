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
The uploaded image is a kit pack list from Factory Five Racing. Extract all parts information in a structured JSON array using the following format:

[
  {
    "box_number": "<box number>",
    "categories": [
      {
        "category_name": "<category name from the bold/emphasized line>",
        "category_number": "<category number from the bold/emphasized line>"
      }
    ],
    "parts": [
      {
        "part_number": "<part number>",
        "category_number": "<category number from the bold/emphasized line> (if applicable)",
        "description": "<part description>",
        "quantity": <quantity as a number>
      }
    ]
  }
]

CRITICAL DETECTION INSTRUCTIONS:
- A line is ONLY a category if it has significantly bolder/darker font than regular parts
- Categories are stored in a separate "categories" array at the box level
- Parts are stored in a separate "parts" array at the box level
- Parts should reference their category through the "category_number" field
- If a box has no bold/emphasized lines, the "categories" array should be empty
- The JSON structure must be maintained with "categories" and "parts" as separate arrays

Example of correct JSON structure for BOX 00 in this image:
{
  "box_number": "00",
  "categories": [
    {
      "category_name": "KIT DOCUMENTATION",
      "category_number": "11049"
    }
  ],
  "parts": [
    {
      "part_number": "10759",
      "category_number": "11049",
      "description": "CERTIFICATE OF ORIGIN",
      "quantity": 1.00
    },
    {
      "part_number": "13858",
      "category_number": "11049",
      "description": "NAMEPLATE",
      "quantity": 1.00
    }
  ]
}

ONLY return the JSON array with no explanations or additional text.
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
      max_tokens: 4096, // Increased token limit for multiple images
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
