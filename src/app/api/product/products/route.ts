
// app/api/product/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/model/AddProduct";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Fetch random products for Special Offer
    const products = await Product.aggregate([
      { $match: { stock: { $gt: 0 } } }, // Only products that are in stock
      { $sample: { size: limit } },
      {
        $project: {
          name: 1,
          description: 1,
          mrp: 1,
          offerPrice: 1,
          images: 1
        }
      }
    ]);

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
