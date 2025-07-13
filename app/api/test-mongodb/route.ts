import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb-utils";

export async function GET() {
  try {
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      database: db.databaseName,
      collections: collections.map(col => col.name),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("MongoDB test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 