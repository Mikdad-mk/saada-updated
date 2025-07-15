"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Question {
  text: string;
  options: string[];
  answer: number;
}

interface Quiz {
  title: string;
  questions: Question[];
  isLive: boolean;
}

export default function LiveQuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true);
      const res = await fetch("/api/current-quiz");
      const data = await res.json();
      if (data && data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuiz(data);
      } else {
        setQuiz(null);
      }
      setLoading(false);
    }
    fetchQuiz();
  }, []);

  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
    setIsCorrect(null);
  }, [currentIdx]);

  if (status === "loading" || loading) return <div className="text-center py-20">Loading...</div>;
  if (!session) {
    router.push("/login");
    return null;
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>No live quiz right now</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please check back later.</p>
            <Button onClick={() => router.push("/quiz")}>Back to Quiz Arena</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Thank you for participating!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Your answers have been submitted.</p>
            <Button onClick={() => router.push("/quiz")}>Back to Quiz Arena</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIdx];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Live Quiz: {quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="font-semibold text-lg mb-4">
              Question {currentIdx + 1} of {quiz.questions.length}
            </p>
            <p className="mb-4">{currentQuestion.text}</p>
            <div className="space-y-2">
              {currentQuestion.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`block p-3 rounded-md border cursor-pointer transition-colors
                    ${selected === idx ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}
                    ${submitted && currentQuestion.answer === idx ? "border-green-600 bg-green-50" : ""}
                    ${submitted && selected === idx && selected !== currentQuestion.answer ? "border-red-600 bg-red-50" : ""}
                  `}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="quiz-option"
                      value={idx}
                      checked={selected === idx}
                      onChange={() => !submitted && setSelected(idx)}
                      disabled={submitted}
                      className="mr-2"
                    />
                    {opt}
                  </div>
                </label>
              ))}
            </div>
          </div>
          {!submitted ? (
            <Button
              className="w-full"
              disabled={selected === null}
              onClick={() => {
                setSubmitted(true);
                setIsCorrect(selected === currentQuestion.answer);
                setAnswers((prev) => {
                  const copy = [...prev];
                  copy[currentIdx] = selected!;
                  return copy;
                });
              }}
            >
              Submit Answer
            </Button>
          ) : (
            <div>
              {isCorrect !== null && (
                <div className="mt-6 text-center">
                  {isCorrect ? (
                    <div className="text-green-600 text-xl font-bold animate-bounce">✔ Correct!</div>
                  ) : (
                    <div className="text-red-600 text-xl font-bold">
                      ✖ Wrong!<br />
                      <span className="text-base font-normal">
                        Correct answer: <span className="font-semibold">{currentQuestion.options[currentQuestion.answer]}</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
              <Button
                className="w-full mt-4"
                onClick={() => {
                  if (currentIdx < quiz.questions.length - 1) {
                    setCurrentIdx((idx) => idx + 1);
                  } else {
                    setShowResult(true);
                  }
                  setSelected(null);
                  setSubmitted(false);
                  setIsCorrect(null);
                }}
              >
                {currentIdx < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}