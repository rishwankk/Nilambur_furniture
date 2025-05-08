import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Admin from "@/model/Admin";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  await connectDb();

  const { username, email, password } = await request.json();

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return NextResponse.json(
      { message: "Admin already exists!" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = new Admin({ username, email, password: hashedPassword });
  await newAdmin.save();
  console.log("sucessfully updated");

  return NextResponse.json({
    message: "Signup successful!",
    admin: { username, email },
  });
}
