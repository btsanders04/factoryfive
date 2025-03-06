// Function to fetch a token from your auth service

export interface TokenData {
  account: string;
  device_id: string;
  ik_message: string;
  is_portal_port: boolean;
  sid: string;
  synotoken: string;
  cookies: string[];
}

export async function fetchToken(): Promise<TokenData | null> {
  try {
     const response = await fetch(
      `https://${process.env.SYNOLOGY_HOST}/webapi/entry.cgi?api=SYNO.API.Auth&format=cookie&method=login&account=${process.env.SYNOLOGY_USER}&passwd=${process.env.SYNOLOGY_PASS}&session=webui&version=6&enable_syno_token=yes`,
      {
        method: "GET",
        // Disable Next.js cache to ensure we get a fresh response
        cache: "no-store",
      }
    );


    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    const data = (await response.json()).data as TokenData;
    const headers = response.headers;
    return { ...data, cookies: headers.getSetCookie() };
    // Store token with expiration (assuming your auth service returns expiresIn in seconds)
    // return data.synotoken;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}
