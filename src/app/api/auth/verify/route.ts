import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Get token from authorization header
    console.log('Checking authorization header...');
    const authHeader = request.headers.get('authorization');
    
    // Get token from cookies - handling Promise
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('auth_token')?.value;
    
    // Use either the header token or cookie token
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : cookieToken;

    if (!token) {
      console.log('No token found in header or cookies');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET_KEY;
    
    if (!secret) {
      console.error('JWT_SECRET_KEY is not defined in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
      
      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        console.log('Token has expired');
        return NextResponse.json({ error: 'Token expired' }, { 
          status: 401,
          headers: {
            'Set-Cookie': 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
          }
        });
      }

      return NextResponse.json({ 
        valid: true,
        user: {
          id: decoded.id,
          email: decoded.email
        }
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ error: 'Invalid token' }, { 
        status: 401,
        headers: {
          'Set-Cookie': 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
      });
    }

  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}