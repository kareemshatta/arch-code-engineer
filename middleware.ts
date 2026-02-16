import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Protect admin routes (except login)
    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      !req.nextUrl.pathname.startsWith('/admin/login') &&
      !req.nextauth.token
    ) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without token
        if (req.nextUrl.pathname.startsWith('/admin/login')) {
          return true;
        }
        // Require token for other admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }
        // Allow all other routes
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
