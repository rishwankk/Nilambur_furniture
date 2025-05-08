import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('adminToken')?.value;
  console.info('Request URL:', request.url);

  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verify token using jose
      const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
      const verified = await jose.jwtVerify(token, secret);
      console.info('Token verified:', verified);
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      console.error('Token verification failed:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};