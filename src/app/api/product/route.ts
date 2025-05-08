import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/model/AddProduct"; // Product schema
import dbConnect from "@/lib/db"; // Database connection utility

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("product");
  console.log(productId,"...........");
  

  if (!productId) {
    return NextResponse.json({ error: "Product ID not found" }, { status: 400 });
  }

  try {
    console.log("trying to get product");
    
    // Connect to the database
    await dbConnect();

    // Fetch the product with the specified product ID
    const product = await Product.findById(productId);
    console.log(product);
    
    if (!product) {
      return NextResponse.json(
        { error: "No product found with the given ID" },
        { status: 404 }
      );
    }

    // Return the product as JSON
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
