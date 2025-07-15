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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Update debug log
    console.log("[DEBUG] /api/current-quiz POST body:", body);
    const { quizId, questions } = body;
    if (!quizId) {
      return NextResponse.json({ error: "quizId is required" }, { status: 400 });
    }
    await dbConnect();
    // Set all quizzes to not live
    await Quiz.updateMany({}, { isLive: false });
    // Find the quiz to set as live
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    quiz.isLive = true;
    // Optionally update questions
    if (questions && Array.isArray(questions) && questions.length > 0) {
      quiz.questions = questions;
    }
    await quiz.save();
    return NextResponse.json({ success: true, message: "Live quiz updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to update live quiz" }, { status: 500 });
  }
}