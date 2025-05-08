import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "../../../model/AddProduct";
import Category from "@/model/Categoryschema";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get('category');

  if (!categoryId) {
    return NextResponse.json({ error: 'Category not found' }, { status: 400 });
  }

  try {
    const products = await Product.find({ category: categoryId });

    if (products.length === 0) {
      return NextResponse.json({ error: 'No products found for this category' }, { status: 404 });
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
