import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Quiz } from "@/lib/quiz";

export async function GET() {
  try {
    await dbConnect();
    // Find the quiz marked as live
    const doc = await Quiz.findOne({ isLive: true });

    // If no live quiz is found, return a default one for testing
    if (!doc) {
      return NextResponse.json({
        title: "No live quiz",
        questions: [],
        isLive: false,
      });
    }
    return NextResponse.json(doc);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}