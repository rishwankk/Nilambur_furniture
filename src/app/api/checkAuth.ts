import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const checkAuth = (req: NextRequest) => {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY!);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
