import { NextRequest, NextResponse } from 'next/server';

// For Node.js built-in fetch (Node 18+)
// If you use an older Node.js, you may need node-fetch

export const runtime = 'edge'; // Or 'nodejs' if you need Node APIs

export async function POST(req: NextRequest) {
  try {
    // Parse multipart/form-data
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read file as ArrayBuffer and convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // Prepare Claude API request
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Claude API key not set' }, { status: 500 });
    }

    // Prepare the prompt for Claude
    const prompt = `
      The uploaded file is a kit pack list, and may be either an image or a PDF. It may contain one or more box numbers, each as a header. Under each box number, there will be part numbers, part descriptions, and the expected quantity for each part. 
      
      Please extract all this information and return a structured JSON array in the following format:
      [
        {
          "box_number": "<box number>",
          "parts": [
            {
              "part_number": "<part number>",
              "description": "<part description>",
              "quantity": <quantity as a number>
            },
            ...
          ]
        },
        ...
      ]
      
      Only return the JSON array. Do not include any explanation or extra text. If any fields are missing, leave them blank or null. If the file is not readable, return an empty array.
    `;

    // Claude Vision API endpoint and payload
    const anthropicUrl = 'https://api.anthropic.com/v1/messages';
    const anthropicPayload = {
      model: 'claude-3-opus-20240229', // or another Claude 3 vision model
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: file.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(anthropicUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(anthropicPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Claude API error', details: errorText }, { status: 500 });
    }

    const aiResult = await response.json();
    // Claude's response is usually in aiResult.content[0].text
    let parsed;
    try {
      parsed = JSON.parse(aiResult.content[0].text);
    } catch (e) {
      // If not valid JSON, return raw text
      console.log(e);
      parsed = { raw: aiResult.content[0].text };
    }
    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
