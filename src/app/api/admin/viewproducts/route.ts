import  connectDb  from '@/lib/db';
import Product from '@/model/AddProduct';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
      await connectDb();
      const products = await Product.find().populate('category');
      return NextResponse.json(products);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
  }

export async function DELETE(
  request: NextRequest,
  
) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    await Product.findByIdAndDelete(productId);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const data = await request.json();
    const updatedProduct = await Product.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}