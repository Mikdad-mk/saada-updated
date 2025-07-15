import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Quiz } from "@/lib/quiz";
import { NextRequest } from "next/server";

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

// Add dynamic route support for DELETE and PATCH
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const questionId = pathParts[pathParts.length - 1];
    if (!questionId) {
      return NextResponse.json({ error: "questionId is required" }, { status: 400 });
    }
    await dbConnect();
    // Find the quiz containing this question
    const quiz = await Quiz.findOne({ "questions._id": questionId });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found for this question" }, { status: 404 });
    }
    quiz.questions = quiz.questions.filter((q: any) => q._id.toString() !== questionId);
    await quiz.save();
    return NextResponse.json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const questionId = pathParts[pathParts.length - 1];
    const { text, options, answer } = await req.json();
    if (!questionId || !text || !options || !Array.isArray(options) || options.length < 2 || typeof answer !== "number") {
      return NextResponse.json({ error: "Invalid question data" }, { status: 400 });
    }
    await dbConnect();
    const quiz = await Quiz.findOne({ "questions._id": questionId });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found for this question" }, { status: 404 });
    }
    const question = quiz.questions.id(questionId);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    question.text = text;
    question.options = options;
    question.answer = answer;
    await quiz.save();
    return NextResponse.json({ success: true, message: "Question updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

// Add a handler for reordering questions
export async function PUT(req: Request) {
  try {
    const { quizId, questionIds } = await req.json();
    if (!quizId || !Array.isArray(questionIds)) {
      return NextResponse.json({ error: 'quizId and questionIds are required' }, { status: 400 });
    }
    await dbConnect();
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    // Reorder questions array to match questionIds
    const idMap = new Map(quiz.questions.map((q: any) => [q._id.toString(), q]));
    const newQuestions = questionIds.map((id: string) => idMap.get(id)).filter(Boolean);
    if (newQuestions.length !== quiz.questions.length) {
      return NextResponse.json({ error: 'Some question IDs are missing or invalid' }, { status: 400 });
    }
    quiz.questions = newQuestions;
    await quiz.save();
    return NextResponse.json({ success: true, message: 'Question order updated' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to reorder questions' }, { status: 500 });
  }
}