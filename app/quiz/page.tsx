"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Clock,
  Users,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Star,
  Zap,
  Brain,
  BookOpen,
  Lock,
} from "lucide-react";
import LeaderboardChart from "@/components/charts/leaderboard-chart";
import PerformanceChart from "@/components/charts/performance-chart";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function useCountdown(seconds: number) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const h = Math.floor(timeLeft / 3600)
  const m = Math.floor((timeLeft % 3600) / 60)
  const s = timeLeft % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function QuizPage() {
  const [upcomingQuizzes, setUpcomingQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const timer = useCountdown(60 * 60); // 1 hour
  const [selectedPastQuiz, setSelectedPastQuiz] = useState<any | null>(null);
  const [quizSummary, setQuizSummary] = useState<any | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    async function fetchQuizzes() {
      setLoading(true);
      try {
        const res = await fetch("/api/quiz");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setUpcomingQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setUpcomingQuizzes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  useEffect(() => {
    console.log("Fetched quizzes:", upcomingQuizzes);
  }, [upcomingQuizzes]);

  // Remove upcoming/past split, just show all quizzes
  const quizzesWithDate = upcomingQuizzes.map((quiz) => {
    let quizDateTime: Date | null = null;
    if (quiz.date && quiz.time) {
      const dateTimeString = `${quiz.date}T${quiz.time}:00Z`;
      const parsed = new Date(dateTimeString);
      if (!isNaN(parsed.getTime())) {
        quizDateTime = parsed;
      } else {
        quizDateTime = new Date(`${quiz.date}T${quiz.time}`);
      }
    } else if (quiz.date) {
      const parsed = new Date(`${quiz.date}T00:00:00Z`);
      if (!isNaN(parsed.getTime())) {
        quizDateTime = parsed;
      } else {
        quizDateTime = null;
      }
    }
    return { ...quiz, quizDateTime };
  });

  const quickStats = [
    { label: "Total Participants", value: "2,450", icon: Users, color: "text-blue-600" },
    { label: "Quizzes Completed", value: "156", icon: Target, color: "text-green-600" },
    { label: "Average Score", value: "87.5%", icon: TrendingUp, color: "text-purple-600" },
    { label: "Active Players", value: "89", icon: Zap, color: "text-orange-600" },
  ];

  async function handleOpenPastQuizSummary(quiz: any) {
    setSelectedPastQuiz(quiz);
    setSummaryOpen(true);
    setSummaryLoading(true);
    try {
      // Fetch full quiz details (including questions)
      const res = await fetch(`/api/quiz/${quiz._id}`);
      if (!res.ok) throw new Error("Failed to fetch quiz details");
      const data = await res.json();
      setQuizSummary(data);
    } catch (e) {
      setQuizSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }

  function handleCloseSummary() {
    setSummaryOpen(false);
    setQuizSummary(null);
    setSelectedPastQuiz(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Quiz Arena</h1>
          <p className="text-xl text-gray-600">Test your knowledge and compete with others</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* All Quizzes Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-2">Participate in Quizzes</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading quizzes...</p>
            </div>
          ) : quizzesWithDate.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {quizzesWithDate.map((quiz, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {quiz.date} at {quiz.time}
                          </div>
                        </CardDescription>
                      </div>
                      <Badge variant={quiz.difficulty === "Easy" ? "default" : quiz.difficulty === "Intermediate" ? "secondary" : "destructive"}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Participants</span>
                      <span className="font-medium">{quiz.participants || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Prize</span>
                      <span className="font-medium">{quiz.prize || "Certificate"}</span>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/quiz/live`}>
                        <Play className="w-4 h-4 mr-2" />
                        Participate
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 mb-8">
              <CardContent>
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No quizzes available</h3>
                <p className="text-gray-600 mb-4">Check back later for new quiz challenges!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
