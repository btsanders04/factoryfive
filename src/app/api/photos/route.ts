interface PhotoLibraryResponse {
  success: boolean;
  data: {
    list: MediaItem[];
  };
}

interface MediaItem {
  id: number;
  filename: string;
  filesize: number;
  time: number;
  indexed_time: number;
  owner_user_id: number;
  folder_id: number;
  type: "photo" | "live" | string;
  live_type?: "live" | string;
  additional: {
    resolution: {
      width: number;
      height: number;
    };
    orientation: number;
    orientation_original: number;
    thumbnail: {
      m: string;
      xl: string;
      preview: string;
      sm: string;
      cache_key: string;
      unit_id: number;
    };
    provider_user_id: number;
  };
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get query parameters from the request URL
  // const offset = searchParams.get("offset") || "0";
  // const limit = searchParams.get("limit") || "3";
  const limit = 999;
  const synoToken = request.headers.get("Authorization") as string;
  const cookies = request.headers.get("Cookie") || "";

  // Set up the request to Synology Foto API
  const url = `https://${process.env.SYNOLOGY_HOST}/webapi/entry.cgi`;

  const body = `api=SYNO.Foto.Browse.Item&method=list&version=4&additional=%5B%22thumbnail%22%2C%22resolution%22%2C%22orientation%22%2C%22video_convert%22%2C%22video_meta%22%2C%22provider_user_id%22%5D&offset=0&limit=${limit}&sort_by=%22takentime%22&sort_direction=%22asc%22&passphrase=%22${process.env.SYNOLOGY_PASSKEY}%22`;

  // Set headers
  const headers = {
    "x-syno-token": synoToken,
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie: cookies,
  };

  try {
    // Make the request to Synology Foto API
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: body,
    });

    // Get the JSON response
    const data = (await response.json()) as PhotoLibraryResponse;
    const res = data.data.list.map((item) => ({
      id: item.id,
      url: `/api/photos/${item.additional.thumbnail.unit_id}`,
      cacheKey: item.additional.thumbnail.cache_key,
      title: item.filename,
    }));

    // Return the response
    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching from Synology Foto API:", error);

    // Return error response
    return NextResponse.json(
      { success: false, error: "Failed to fetch data from Synology Foto API" },
      { status: 500 }
    );
  }
}
