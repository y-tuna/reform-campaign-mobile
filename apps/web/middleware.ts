import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import type { UserRole } from './app/api/auth/[...nextauth]/route'

// Define role-based route access rules
const roleBasedAccess: Record<string, UserRole[]> = {
  // MVP Candidate routes (main features)
  '/dashboard': ['candidate', 'admin'],
  '/documents': ['candidate', 'admin'],
  '/guides': ['candidate', 'admin'],
  '/templates': ['candidate', 'admin'],
  '/shop': ['candidate', 'admin'],
  '/campaign-shop': ['candidate', 'admin'],
  '/voter-crm': ['candidate', 'admin'],
  '/education': ['candidate', 'admin'],
  '/profile': ['candidate', 'admin'],
  '/announcements': ['candidate', 'admin'],

  // Shared routes (all authenticated users)
  '/policies': ['candidate', 'admin', 'viewer'],
  '/help': ['candidate', 'admin', 'viewer'],
  '/onboarding': ['candidate', 'admin', 'viewer']
}

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/verify-otp',
  '/auth/error',
  '/auth/unauthorized',
  '/api/auth',
  '/api',
  '/_next',
  '/favicon.ico',
  '/images',
  '/assets'
]

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: any } }) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    
    console.log(`[Middleware] ${req.method} ${pathname}`)
    console.log(`[Middleware] User role: ${token?.role}`)

    // Check if user has required role for the route
    const requiredRoles = getRoleForPath(pathname)
    
    if (requiredRoles.length > 0) {
      const userRole = token?.role as UserRole
      
      if (!userRole || !requiredRoles.includes(userRole)) {
        console.log(`[Middleware] Access denied. Required: ${requiredRoles}, User: ${userRole}`)
        
        // Redirect based on user role
        if (userRole === 'candidate') {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        } else if (userRole === 'admin' || userRole === 'viewer') {
          return NextResponse.redirect(new URL('/candidates', req.url))
        } else {
          return NextResponse.redirect(new URL('/auth/login', req.url))
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow public routes
        if (isPublicRoute(pathname)) {
          return true
        }
        
        // Require token for all other routes
        return !!token
      },
    },
  }
)

function getRoleForPath(pathname: string): UserRole[] {
  // First check if it's a public route - return empty array if so
  if (isPublicRoute(pathname)) {
    return []
  }
  
  // Check exact matches first
  if (roleBasedAccess[pathname]) {
    return roleBasedAccess[pathname]
  }
  
  // Check for parent paths (e.g., /admin/users should match /admin rules)
  for (const [route, roles] of Object.entries(roleBasedAccess)) {
    if (pathname.startsWith(route + '/') || pathname === route) {
      return roles
    }
  }
  
  // Default: allow all authenticated users for unspecified routes
  return ['candidate', 'admin', 'viewer']
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith('/')) {
      return pathname.startsWith(route)
    }
    return pathname === route || pathname.startsWith(route + '/')
  })
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Match all routes except static files, images, and public assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.ico$).*)'
  ]
}