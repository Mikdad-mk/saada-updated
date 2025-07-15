import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Quiz } from "@/lib/quiz";
import { NextRequest } from "next/server";

// DELETE: delete a question by its ID
export async function DELETE(req: NextRequest, { params }: { params: { questionId: string } }) {
  try {
    const questionId = params.questionId;
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

// PATCH: update a question by its ID
export async function PATCH(req: NextRequest, { params }: { params: { questionId: string } }) {
  try {
    const questionId = params.questionId;
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