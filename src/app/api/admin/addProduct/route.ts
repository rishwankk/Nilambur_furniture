import { NextRequest, NextResponse } from 'next/server';
import Product, { IProduct } from '@/model/AddProduct';
import Category from '@/model/Categoryschema';
import connectDb from '@/lib/db';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

connectDb();

const upload = multer({
  dest: './public/uploads/',
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed') as any, false);
    }
    cb(null, true);
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const mrp = parseFloat(formData.get('mrp') as string);
    const offerPrice = parseFloat(formData.get('offerPrice') as string);
    const stock = parseInt(formData.get('stock') as string, 10);
    const category = formData.get('category') as string;

    if (!name || !description || isNaN(mrp) || isNaN(offerPrice) || isNaN(stock) || !category) {
      return NextResponse.json(
        { error: 'Invalid or missing required fields', status: 400 },
        { status: 400 }
      );
    }

    const categoryId = mongoose.Types.ObjectId.isValid(category) ? new mongoose.Types.ObjectId(category) : null;

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Invalid category ID', status: 400 },
        { status: 400 }
      );
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Category not found', status: 404 },
        { status: 404 }
      );
    }

    const imageFiles: File[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith('images') && value instanceof File) {
        imageFiles.push(value);
      }
    });

    const uploadedImages: string[] = [];
    const uploadPromises = imageFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const fileName = Date.now() + path.extname(file.name);
        const uploadPath = path.join('./public/uploads', fileName);

        file.arrayBuffer().then((buffer) => {
          fs.writeFile(uploadPath, Buffer.from(buffer), (err: any) => {
            if (err) {
              reject(`Error saving image: ${err}`);
            } else {
              resolve(`/uploads/${fileName}`);
            }
          });
        }).catch((error) => reject(`Error processing image: ${error}`));
      });
    });

    try {
      uploadedImages.push(...await Promise.all(uploadPromises));
    } catch (error) {
      return NextResponse.json(
        { error: 'Error uploading images', details: error },
        { status: 500 }
      );
    }

    const newProduct: IProduct = new Product({
      name,
      description,
      mrp,
      offerPrice,
      stock,
      category: categoryId,
      images: uploadedImages,
    });

    const savedProduct = await newProduct.save();

    return NextResponse.json(
      { message: 'Product added successfully', product: savedProduct, status: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json(
      { error: 'Error adding product', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const products = await Product.find();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error fetching products', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');
    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
      return NextResponse.json(
        { error: 'Invalid product ID', status: 400 },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id as string);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully', status: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error deleting product', details: (error as Error).message },
      { status: 500 }
    );
  }
}
