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

  // Filter and sort quizzes by date/time
  const now = new Date();
  const quizzesWithDate = upcomingQuizzes.map((quiz) => {
    let quizDateTime: Date | null = null;
    if (quiz.date && quiz.time) {
      // Parse as UTC to avoid timezone issues
      // Accepts 'YYYY-MM-DD' and 'HH:mm' (24-hour)
      const dateTimeString = `${quiz.date}T${quiz.time}:00Z`;
      const parsed = new Date(dateTimeString);
      if (!isNaN(parsed.getTime())) {
        quizDateTime = parsed;
      } else {
        // fallback: try local time (less reliable)
        quizDateTime = new Date(`${quiz.date}T${quiz.time}`);
      }
    } else if (quiz.date) {
      // If only date, treat as start of day UTC
      const parsed = new Date(`${quiz.date}T00:00:00Z`);
      if (!isNaN(parsed.getTime())) {
        quizDateTime = parsed;
      } else {
        quizDateTime = null;
      }
    }
    return { ...quiz, quizDateTime };
  });
  const futureQuizzes = quizzesWithDate
    .filter((quiz) => quiz.quizDateTime && quiz.quizDateTime > now)
    .sort((a, b) => (a.quizDateTime as Date).getTime() - (b.quizDateTime as Date).getTime());
  const pastQuizzes = quizzesWithDate
    .filter((quiz) => quiz.quizDateTime && quiz.quizDateTime <= now)
    .sort((a, b) => (b.quizDateTime as Date).getTime() - (a.quizDateTime as Date).getTime());

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

        {/* Main Content */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Quizzes</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading quizzes...</p>
              </div>
            ) : (
              <>
                {/* Upcoming Quizzes */}
                <h2 className="text-2xl font-bold mb-2">Upcoming Quizzes</h2>
                {futureQuizzes.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {futureQuizzes.map((quiz, index) => (
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
                              Join Quiz
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
                      <h3 className="text-xl font-semibold mb-2">No upcoming quizzes</h3>
                      <p className="text-gray-600 mb-4">Check back later for new quiz challenges!</p>
                    </CardContent>
                  </Card>
                )}
                {/* Past Quizzes */}
                <h2 className="text-2xl font-bold mb-2">Past Quizzes</h2>
                {pastQuizzes.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pastQuizzes.map((quiz, index) => (
                      <div key={index} className="relative">
                        <Card
                          className="opacity-60 cursor-pointer hover:opacity-80 transition pointer-events-auto"
                          onClick={() => handleOpenPastQuizSummary(quiz)}
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Lock className="w-5 h-5 text-gray-400" />
                                  {quiz.title}
                                </CardTitle>
                                <CardDescription className="mt-2">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    {quiz.date} at {quiz.time}
                                  </div>
                                </CardDescription>
                              </div>
                              <Badge variant="outline" className="flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</Badge>
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
                          </CardContent>
                          <div className="absolute inset-0 bg-gray-200 opacity-40 rounded-lg pointer-events-none" />
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold mb-2">No past quizzes</h3>
                      <p className="text-gray-600 mb-4">You haven't missed any quizzes yet!</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>This week's leaderboard</CardDescription>
              </CardHeader>
              <CardContent>
                <LeaderboardChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Performance</CardTitle>
                <CardDescription>Track your quiz performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

            {/* Past Quiz Summary Modal */}
            <Dialog open={summaryOpen} onOpenChange={handleCloseSummary}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Quiz Summary</DialogTitle>
                  <DialogDescription>
                    {selectedPastQuiz ? (
                      <span>
                        {selectedPastQuiz.title} <br />
                        {selectedPastQuiz.date} at {selectedPastQuiz.time}
                      </span>
                    ) : null}
                  </DialogDescription>
                </DialogHeader>
                {summaryLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : quizSummary ? (
                  <div className="space-y-4">
                    {/* Debug: Show raw quizSummary object */}
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mb-2">{JSON.stringify(quizSummary, null, 2)}</pre>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span><strong>Participants:</strong> {quizSummary.participants || 0}</span>
                      <span><strong>Prize:</strong> {quizSummary.prize || "Certificate"}</span>
                      {/* Add more stats as needed */}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Questions & Answers</h4>
                      <div className="space-y-3">
                        {quizSummary.questions && quizSummary.questions.length > 0 ? (
                          quizSummary.questions.map((q: any, idx: number) => (
                            <div key={q._id || idx} className="p-3 border rounded">
                              <div className="font-medium mb-1">Q{idx + 1}: {q.text}</div>
                              <ul className="ml-4 list-disc">
                                {q.options.map((opt: string, oidx: number) => (
                                  <li key={oidx} className={oidx === q.answer ? "text-green-700 font-semibold" : ""}>
                                    {opt} {oidx === q.answer && <span className="ml-2 text-xs">✓ Correct</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                        ) : (
                          <div>No questions found.</div>
                        )}
                      </div>
                    </div>
                    {/* User's own score (if available) */}
                    {quizSummary.userScore !== undefined && (
                      <div className="mt-4 p-3 bg-blue-50 rounded text-blue-800 font-semibold">
                        Your Score: {quizSummary.userScore}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-red-600">Failed to load quiz summary.</div>
                )}
              </DialogContent>
            </Dialog>
      </div>
    </div>
  );
}
