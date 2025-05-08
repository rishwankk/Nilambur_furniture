import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = new NextResponse(
    JSON.stringify({ message: 'Logged out successfully' }),
    { status: 200 }
  );

  response.cookies.set('adminToken', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}