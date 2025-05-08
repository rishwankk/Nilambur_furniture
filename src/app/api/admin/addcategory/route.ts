import mongoose from 'mongoose';
import Category from '../../../../model/Categoryschema';
import { NextRequest, NextResponse } from 'next/server'; // Importing NextRequest and NextResponse
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) { // Use NextRequest here
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const categoryImage = formData.get('image') as File;

    if (!name || !categoryImage) {
        return NextResponse.json(
          { error: 'Title and banner image are required' },
          { status: 400 }
        );
      }
      const fileName = Date.now() + path.extname(categoryImage.name);
      const uploadPath = path.join('./public/uploads', fileName);
      const buffer = Buffer.from(await categoryImage.arrayBuffer());
      await fs.writeFile(uploadPath, buffer);
      const category=new Category({
        name,
        image: `/uploads/${fileName}`,
      })
      await category.save();
      return NextResponse.json(
        { message: 'Category uploaded successfully', category },
        { status: 201 }
      );
   
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { message: 'Server error, please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) { // Use NextRequest here
  try {
    // Log the MongoDB URI
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log("Attempting to connect to MongoDB...");
      await mongoose.connect(process.env.MONGO_URI as string);
      console.log("MongoDB connected successfully.");
    }

    // Fetch all categories from the database
    const categories = await Category.find(); // Fetch all categories
    console.log('Fetched categories:', categories);

    return NextResponse.json(
      { message: 'Categories fetched successfully!', categories },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories.' },
      { status: 500 }
    );
  }
}
