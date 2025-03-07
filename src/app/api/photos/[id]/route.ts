import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const id = (await params).id;
    const size = searchParams.get("size") || "xl";
    // const cacheKey = searchParams.get("cacheKey");
    const passphrase = process.env.SYNOLOGY_PASSKEY || "";
    const synoToken = request.headers.get("Authorization") as string;
    const cookies = request.headers.get("Cookie") || "";
    // Construct the target URL
    const targetUrl = new URL(
      `https://${process.env.SYNOLOGY_HOST}/synofoto/api/v2/p/Thumbnail/get`
    );
    targetUrl.searchParams.set("id", id);
    targetUrl.searchParams.set("cache_key", uuid());
    targetUrl.searchParams.set("type", "unit");
    targetUrl.searchParams.set("size", size);
    targetUrl.searchParams.set("passphrase", passphrase);
    targetUrl.searchParams.set("SynoToken", synoToken);

    // Set up fetch options with all required headers
    const fetchOptions: RequestInit = {
      method: "GET",
      headers: {
        accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        cookie: cookies,
      },
    };

    // Make the request to the Synology server
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (await fetch(targetUrl.toString(), fetchOptions)) as any;

    // Get the image data as an array buffer
    const imageData = await response.arrayBuffer();

    // Create a new response with the image data
    const newResponse = new NextResponse(imageData, {
      status: response.status,
      statusText: response.statusText,
    });

    const contentType = response.headers.get("content-type");
    if (contentType) {
      newResponse.headers.set("content-type", contentType);
    } else {
      // Set a default image content type if none was provided
      newResponse.headers.set("content-type", "image/jpeg");
    }

    // Add cache control headers to improve performance
    newResponse.headers.set("cache-control", "public, max-age=3600");

    return newResponse;
  } catch (error) {
    console.error("Error fetching thumbnail:", error);
    return NextResponse.json(
      { error: "Failed to fetch thumbnail" },
      {
        status: 500,
      }
    );
  }
}
