import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Quiz } from "@/lib/quiz";

// GET: fetch questions for a specific quiz
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");
    await dbConnect();
    if (!quizId) {
      return NextResponse.json({ error: "quizId is required" }, { status: 400 });
    }
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(quiz.questions);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

// POST: add a new question to a quiz
export async function POST(req: Request) {
  try {
    const { quizId, text, options, answer } = await req.json();
    if (!quizId || !text || !options || !Array.isArray(options) || options.length < 2 || typeof answer !== "number") {
      return NextResponse.json({ error: "Invalid question data" }, { status: 400 });
    }
    await dbConnect();
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    quiz.questions.push({ text, options, answer } as any);
    const savedQuiz = await quiz.save();
    const newQuestion = savedQuiz.questions[savedQuiz.questions.length - 1];
    return NextResponse.json({ success: true, message: "Question added successfully", id: newQuestion._id });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 });
  }
}