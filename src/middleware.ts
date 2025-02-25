import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/auth"

export default async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Get the pathname of the request
  const { pathname } = request.nextUrl
  
  // Define which routes should be accessible without authentication
  const isPublicRoute = ['/login', '/register', '/api/auth'].some(route => 
    pathname.startsWith(route)
  )
  
  // If the user is not logged in and trying to access a protected route,
  // redirect them to the login page
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If the user is logged in and trying to access the login page,
  // redirect them to the home page
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Continue with the request
  return NextResponse.next()
}

// Configure which routes should be handled by the middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}