import mongoose, { Schema, Document, Model } from "mongoose";
import { getModel } from "./utils";

export interface IQuestion extends Document {
  text: string;
  options: string[];
  answer: number; // index of correct option
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: Number, required: true },
});

export interface IQuiz extends Document {
  title: string;
  questions: IQuestion[];
  isLive: boolean;
  createdAt: Date;
  date: string;
  time: string;
  prize: string;
  participants: number;
}

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  questions: { type: [QuestionSchema], default: [] },
  isLive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  date: { type: String, required: true },
  time: { type: String, required: true },
  prize: { type: String, default: "" },
  participants: { type: Number, default: 0 },
});

export const Question: Model<IQuestion> = getModel<IQuestion>("Question", QuestionSchema);
export const Quiz: Model<IQuiz> = getModel<IQuiz>("Quiz", QuizSchema); 