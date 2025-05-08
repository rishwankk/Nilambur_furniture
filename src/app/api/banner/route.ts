import { NextRequest, NextResponse } from 'next/server';
import Banner from '@/model/Banner';

export async function GET(req: NextRequest) {
  try {
    // Fetch all banners from the database
    console.log("banner get.....................")
    const banners = await Banner.find();
    console.log(banners,"...............");
    

    return NextResponse.json(
      { message: 'Banners fetched successfully', banners },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Error fetching banners', details: (error as Error).message },
      { status: 500 }
    );
  }
}
