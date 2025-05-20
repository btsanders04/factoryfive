import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "./stack";
import { fetchToken, TokenData } from "./data/synology-auth";

let tokenCache: TokenData | null;

// Helper function to merge cookies without duplicates
function mergeAndDedupeCookies(existingCookiesStr: string, newCookiesArr: string[]): string {
  // Parse existing cookies
  const existingCookies = new Map();
  if (existingCookiesStr) {
    existingCookiesStr.split(';').forEach(cookie => {
      const parts = cookie.trim().split('=');
      if (parts.length >= 2) {
        existingCookies.set(parts[0], parts.slice(1).join('='));
      }
    });
  }
  
  // Parse and add new cookies
  newCookiesArr.forEach(cookieStr => {
    const mainPart = cookieStr.split(';')[0].trim();
    const parts = mainPart.split('=');
    if (parts.length >= 2) {
      existingCookies.set(parts[0], parts.slice(1).join('='));
    }
  });
  
  // Convert back to string
  return Array.from(existingCookies.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

// Check if token is expired (or about to expire)
function isTokenExpiredOrMissing(): boolean {
  if (!tokenCache) return true;
  
  // Get current time in milliseconds
  const now = Date.now();
  
  // Check if current time is past expiration
  return now >= tokenCache.expiresAt;
}



export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  
  // Define public API routes that don't require authentication for GET requests
  const publicApiRoutes = [
    '/api/alt-statistics',
    '/api/workhours',
    '/api/inventory-parts',
    '/api/tasksections',
    '/api/milestones',
    '/api/photos',
    '/api/guestbook'
  ];
  
  // Define routes that allow both GET and POST methods without authentication
  const publicPostRoutes = [
    '/api/guestbook'
  ];
  
  // Check if the current request is for a public API route
  const isPublicApiRoute = publicApiRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Check if the current request is for a route that allows POST without authentication
  const isPublicPostRoute = publicPostRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Allow public access for GET requests to public API routes
  // or POST requests to specific public POST routes
  const isPublicAccessAllowed = (isPublicApiRoute && request.method === 'GET') || 
                               (isPublicPostRoute && request.method === 'POST');
  
  // Perform authentication check for non-public routes or non-GET methods
  if (!isPublicAccessAllowed) {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.redirect(new URL("/public/dashboard", request.url));
    }
  }
  
  // Handle Synology photos API token
  if (request.nextUrl.pathname.startsWith("/api/photos")) {
    if (isTokenExpiredOrMissing()) {
      const response = await fetchToken();
      tokenCache = response;
    }
    if (tokenCache) {
      requestHeaders.set("Authorization", `${tokenCache.synotoken}`);
      const existingCookies = request.headers.get('Cookie') || '';
      const mergedCookies = mergeAndDedupeCookies(existingCookies,tokenCache.cookies);
      requestHeaders.set('Cookie', mergedCookies);
    }
  }
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
export const config = {
  // You can add your own route protection logic here
  // Make sure not to protect the root URL, as it would prevent users from accessing static Next.js files or Stack's /handler path
  // Also exclude public routes and API endpoints that should be publicly accessible
  matcher: "/((?!handler|_next|static|public|.*\\..*).*)",
};

// 42vcYVFfZrO6jw4ghkPHr83-TCwxeDPmrdhY44XcdFoW4bAfPlzn9lZ5L2yt68pHOEQo7_zcsFDaWYcdMirovg;
