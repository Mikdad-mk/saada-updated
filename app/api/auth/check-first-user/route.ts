import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const users = client.db().collection("users");
    
    // Count total users in the database
    const userCount = await users.countDocuments();
    const isFirstUser = userCount === 0;

    return NextResponse.json({
      isFirstUser: isFirstUser,
      userCount: userCount,
    });
  } catch (error) {
    console.error("Error checking first user status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 