import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Quiz } from "@/lib/quiz";

export async function GET(req: Request, context: { params: { quizId: string } }) {
  try {
    const { quizId } = context.params;
    if (!quizId) {
      return NextResponse.json({ error: "quizId is required" }, { status: 400 });
    }
    await dbConnect();
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    // Return all quiz details (including questions)
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch quiz details" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { quizId: string } }) {
  try {
    const { quizId } = context.params;
    if (!quizId) {
      return NextResponse.json({ error: "quizId is required" }, { status: 400 });
    }
    await dbConnect();
    const result = await Quiz.findByIdAndDelete(quizId);
    if (!result) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
} 