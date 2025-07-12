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
} from "lucide-react";
import LeaderboardChart from "@/components/charts/leaderboard-chart";
import PerformanceChart from "@/components/charts/performance-chart";
import Link from "next/link";

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
        // Fallback data if API fails
        setUpcomingQuizzes([
          {
            title: "Weekly General Knowledge",
            difficulty: "Intermediate",
            date: "June 15, 2023",
            time: "3:00 PM",
            participants: 45,
            prize: "Certificate + Badge"
          },
          {
            title: "Science Quiz Challenge",
            difficulty: "Advanced",
            date: "June 18, 2023",
            time: "4:30 PM",
            participants: 32,
            prize: "Trophy + Certificate"
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  const quickStats = [
    { label: "Total Participants", value: "2,450", icon: Users, color: "text-blue-600" },
    { label: "Quizzes Completed", value: "156", icon: Target, color: "text-green-600" },
    { label: "Average Score", value: "87.5%", icon: TrendingUp, color: "text-purple-600" },
    { label: "Active Players", value: "89", icon: Zap, color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center gap-2">
            <span role="img" aria-label="quiz">🧠</span> Live Quiz Arena
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Test your knowledge, compete with peers, and climb the leaderboard in our interactive quiz sessions
          </p>
        </div>

        {/* Live Now Banner */}
        <div className="mb-6 sm:mb-8">
          <div className="rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 lg:mb-0 w-full lg:w-auto">
              <span className="flex items-center text-sm sm:text-base">
                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                LIVE NOW: Weekly General Quiz
              </span>
              <span className="hidden sm:inline-block text-pink-100 ml-4 text-sm">Join 89 students currently participating</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <Button asChild className="bg-white text-red-600 hover:bg-red-50 w-full sm:w-auto text-sm sm:text-base" size="lg">
                <Link href="/quiz/live">
                  <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> 
                  Join Live Quiz
                </Link>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 bg-transparent w-full sm:w-auto text-sm sm:text-base" size="lg">
                <Users className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> 
                View Live Participants
              </Button>
            </div>
            <div className="text-center lg:text-right mt-4 lg:mt-0 lg:ml-8 w-full lg:w-auto">
              <div className="text-xl sm:text-2xl font-bold">{timer}</div>
              <div className="text-pink-100 text-xs sm:text-sm">Time Remaining</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="leaderboard" className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-2 gap-1 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="leaderboard" className="flex items-center justify-center space-x-1 text-xs sm:text-sm">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
              <span className="sm:hidden">Board</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center justify-center space-x-1 text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Performance</span>
              <span className="sm:hidden">Perf</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center justify-center space-x-1 text-xs sm:text-sm">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Upcoming</span>
              <span className="sm:hidden">Events</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center justify-center space-x-1 text-xs sm:text-sm">
              <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Practice</span>
              <span className="sm:hidden">Quiz</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6 sm:space-y-8">
            <LeaderboardChart />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 sm:space-y-8">
            <PerformanceChart />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6 sm:space-y-8">
            {loading ? (
              <div className="text-center py-8 sm:py-12 text-base sm:text-lg text-muted-foreground">Loading quizzes...</div>
            ) : (
              <div className="grid gap-4 sm:gap-6">
                {upcomingQuizzes.length === 0 ? (
                  <div className="text-center text-muted-foreground">No upcoming quizzes found.</div>
                ) : (
                  upcomingQuizzes.map((quiz, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                          <CardTitle className="text-lg sm:text-xl">{quiz.title}</CardTitle>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 w-fit">
                            {quiz.difficulty}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm sm:text-base">Compete with students and win exciting prizes</CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-xs sm:text-sm">{quiz.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-xs sm:text-sm">{quiz.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-xs sm:text-sm">{quiz.participants} registered</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Trophy className="w-4 h-4 text-gray-500" />
                            <span className="text-xs sm:text-sm">{quiz.prize}</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base">Register Now</Button>
                          <Button variant="outline" className="text-sm sm:text-base">Set Reminder</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="practice" className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: "General Knowledge", questions: 50, difficulty: "Mixed", icon: Brain },
                { title: "Science & Tech", questions: 30, difficulty: "Advanced", icon: Zap },
                { title: "History & Culture", questions: 40, difficulty: "Intermediate", icon: BookOpen },
                { title: "Mathematics", questions: 25, difficulty: "Advanced", icon: Target },
                { title: "Literature", questions: 35, difficulty: "Intermediate", icon: BookOpen },
                { title: "Current Affairs", questions: 45, difficulty: "Mixed", icon: TrendingUp },
              ].map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center px-4 sm:px-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <category.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">{category.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {category.questions} questions &bull; {category.difficulty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <Button className="w-full text-sm sm:text-base">
                      <Play className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
