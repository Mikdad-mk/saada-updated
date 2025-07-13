import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Auth API is working",
    timestamp: new Date().toISOString(),
    env: {
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
    }
  });
} 