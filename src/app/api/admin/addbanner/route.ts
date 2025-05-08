import { NextRequest, NextResponse } from 'next/server';
import Banner from '@/model/Banner';
import connectDb from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

connectDb();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const bannerImage = formData.get('file') as File;

    if (!title || !bannerImage) {
      return NextResponse.json(
        { error: 'Title and banner image are required' },
        { status: 400 }
      );
    }

    const fileName = Date.now() + path.extname(bannerImage.name);
    const uploadPath = path.join('./public/uploads', fileName);

    // Write the file to the server
    const buffer = Buffer.from(await bannerImage.arrayBuffer());
    await fs.writeFile(uploadPath, buffer);

    // Save banner data to the database
    const banner = new Banner({
      title,
      imageUrl: `/uploads/${fileName}`,
    });
    await banner.save();

    return NextResponse.json(
      { message: 'Banner uploaded successfully', banner },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json(
      { error: 'Error processing banner upload', details: (error as Error).message },
      { status: 500 }
    );
  }
}
