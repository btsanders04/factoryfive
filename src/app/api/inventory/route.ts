import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText, data } = body;
    // TODO: Add your database logic here
    console.log('Received inventory:', { rawText, data });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process inventory data: ' + JSON.stringify(error) }, { status: 500 });
  }
}
