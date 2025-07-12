import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Quiz } from "@/lib/quiz";

export async function GET() {
  try {
    await dbConnect();
    const quizzes = await Quiz.find({});
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const quizData = await req.json();
    
    // Validate quiz data
    if (!quizData.title || !quizData.difficulty || !quizData.date || !quizData.time) {
      return NextResponse.json({ error: "Missing required quiz fields" }, { status: 400 });
    }
    
    // Add timestamp
    quizData.createdAt = new Date();
    
    await dbConnect();
    const result = await Quiz.create(quizData);
    
    return NextResponse.json({ 
      success: true, 
      id: result._id,
      message: "Quiz added successfully" 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to add quiz" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { quizId } = await req.json();
    if (!quizId) {
      return NextResponse.json({ error: "quizId is required" }, { status: 400 });
    }
    await dbConnect();
    // Unset isLive for all quizzes
    await Quiz.updateMany({}, { $set: { isLive: false } });
    // Set isLive for the selected quiz
    await Quiz.findByIdAndUpdate(quizId, { isLive: true });
    return NextResponse.json({ success: true, message: "Quiz set as live" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to set live quiz" }, { status: 500 });
  }
}