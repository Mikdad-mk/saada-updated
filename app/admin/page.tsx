"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Settings,
  FileText,
  BarChart3,
  Mail,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Activity,
  UserCheck,
  MessageSquare,
  Bell,
  Database,
  Globe,
  Lock,
  Brain,
  LogOut,
  User,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type Quiz = {
  _id: any;
  questionCount: number;
  title: string;
  difficulty: string;
  date: string;
  time: string;
  prize: string;
};

type Question = {
  _id?: any;
  question: string;
  options: string[];
  correct: number;
};

export default function AdminPage() {
  const { user, isAuthenticated, isAdmin, canAccessAdmin, status } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === "loading") return;
    
    if (!isAuthenticated) {
      router.push("/login?callbackUrl=/admin");
      return;
    }
    
    if (!canAccessAdmin()) {
      router.push("/unauthorized");
      return;
    }
  }, [isAuthenticated, canAccessAdmin, status, router]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not admin
  if (!isAuthenticated || !canAccessAdmin()) {
    return null;
  }

  // All hooks at the top!
  const [activeTab, setActiveTab] = useState("dashboard");
  const [liveQuiz, setLiveQuiz] = useState({ question: "", options: ["", ""], correct: 0 });
  const [liveQuizLoading, setLiveQuizLoading] = useState(false);
  const [liveQuizSuccess, setLiveQuizSuccess] = useState(false);
  const [liveQuizError, setLiveQuizError] = useState("");
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizLoading, setQuizLoading] = useState(true);
  const [newQuiz, setNewQuiz] = useState({ title: "", difficulty: "", date: "", time: "", prize: "" });
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizSubmitError, setQuizSubmitError] = useState("");

  const [questionsDialogOpen, setQuestionsDialogOpen] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Question>({ question: "", options: ["", ""], correct: 0 });
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [questionError, setQuestionError] = useState("");

  useEffect(() => {
    async function fetchLiveQuiz() {
      const res = await fetch("/api/live-quiz");
      const data = await res.json();
      if (data && data.question && data.options) {
        setLiveQuiz({ question: data.question, options: data.options, correct: data.correct ?? 0 });
      }
    }
    fetchLiveQuiz();
  }, []);
  
  useEffect(() => {
    async function fetchQuizzes() {
      setQuizLoading(true);
      try {
        const res = await fetch("/api/quiz");
        if (!res.ok) throw new Error("Failed to fetch quizzes");
        const data = await res.json();
        setQuizzes(data as Quiz[]); // Cast to Quiz[]
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setQuizLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  async function handleLiveQuizSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLiveQuizError("");
    setLiveQuizLoading(true);
    setLiveQuizSuccess(false);
    // Validation: all options non-empty, correct index valid
    if (
      !liveQuiz.question.trim() ||
      liveQuiz.options.some(opt => !opt.trim()) ||
      liveQuiz.correct < 0 ||
      liveQuiz.correct >= liveQuiz.options.length ||
      !liveQuiz.options[liveQuiz.correct].trim()
    ) {
      setLiveQuizError("Please fill in the question, all options, and select a valid correct answer.");
      setLiveQuizLoading(false);
      return;
    }
    const res = await fetch("/api/live-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(liveQuiz),
    });
    setLiveQuizLoading(false);
    if (res.ok) setLiveQuizSuccess(true);
  }
  
  async function handleNewQuizSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setQuizSubmitting(true);
    setQuizSubmitError("");
    
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuiz),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create quiz");
      }
      
      const data = await res.json();
      setQuizzes([...quizzes, {...newQuiz, _id: data.id, questionCount: 0}]);
      setNewQuiz({ title: "", difficulty: "", date: "", time: "", prize: "" });
      
      // Close the dialog by triggering a click on the dialog's close button
      const closeButton = document.querySelector('[data-state="open"] button[data-state="closed"]') as HTMLButtonElement;
      closeButton?.click();
    } catch (error: any) {
      console.error("Error creating quiz:", error);
      setQuizSubmitError(error.message);
    } finally {
      setQuizSubmitting(false);
    }
  }

  async function handleManageQuestions(quizId: string) {
    setCurrentQuizId(quizId);
    setQuestionsDialogOpen(true);
    
    try {
      const res = await fetch(`/api/quiz/questions?quizId=${quizId}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuizQuestions(data.map((q: any) => ({
        _id: q._id,
        question: q.text,
        options: q.options,
        correct: q.answer
      })));
    } catch (error: any) {
      console.error("Error fetching questions:", error);
      setQuizQuestions([]);
    }
    
    // Reset the new question form
    // Removed duplicate declaration; only the typed version remains
  }

  async function handleAddQuestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setQuestionError("");
    setQuestionSubmitting(true);
    // Validation: all options non-empty, correct index valid
    if (
      !newQuestion.question.trim() ||
      newQuestion.options.some(opt => !opt.trim()) ||
      newQuestion.correct < 0 ||
      newQuestion.correct >= newQuestion.options.length ||
      !newQuestion.options[newQuestion.correct].trim()
    ) {
      setQuestionError("Please fill in the question, all options, and select a valid correct answer.");
      setQuestionSubmitting(false);
      return;
    }
    try {
      // Send correct field names to backend
      const questionData = {
        text: newQuestion.question,
        options: newQuestion.options,
        answer: newQuestion.correct,
        quizId: currentQuizId
      };
      const res = await fetch("/api/quiz/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add question");
      }
      const data = await res.json();
      // Update local state with frontend type
      setQuizQuestions(prevQuestions => [
        ...prevQuestions,
        {
          _id: data.id,
          question: newQuestion.question,
          options: newQuestion.options,
          correct: newQuestion.correct
        }
      ]);
      setNewQuestion({ question: "", options: ["", ""], correct: 0 });
    } catch (error: any) {
      console.error("Error adding question:", error);
      alert("Failed to add question: " + error.message);
    } finally {
      setQuestionSubmitting(false);
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    try {
      const res = await fetch(`/api/quiz/questions/${questionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete question");
      
      setQuizQuestions(prevQuestions => 
        prevQuestions.filter(q => q._id !== questionId)
      );
    } catch (error: any) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question: " + error.message);
    }
  }

  function handleEditQuiz(quizId: string) {
    // Implementation for editing quiz
    console.log("Edit quiz:", quizId);
  }

  async function handleDeleteQuiz(quizId: string) {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    
    try {
      const res = await fetch(`/api/quiz/${quizId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete quiz");
      
      setQuizzes(prevQuizzes => 
        prevQuizzes.filter(q => q._id !== quizId)
      );
    } catch (error: any) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz: " + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {user?.role}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="live-quiz" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Live Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Quizzes</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-xs text-muted-foreground">+180 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Quizzes</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+89 from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Quiz completed</p>
                        <p className="text-xs text-muted-foreground">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">System maintenance</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Quiz
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      System Settings
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Database className="w-4 h-4 mr-2" />
                      Backup Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Quiz Tab */}
          <TabsContent value="live-quiz" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Quiz Management</CardTitle>
                <CardDescription>
                  Create and manage live quiz questions for real-time competitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLiveQuizSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Question</label>
                    <Textarea
                      placeholder="Enter the quiz question..."
                      value={liveQuiz.question}
                      onChange={(e) => setLiveQuiz({ ...liveQuiz, question: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {liveQuiz.options.map((option, index) => (
                      <div key={index}>
                        <label className="text-sm font-medium">Option {index + 1}</label>
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...liveQuiz.options];
                            newOptions[index] = e.target.value;
                            setLiveQuiz({ ...liveQuiz, options: newOptions });
                          }}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Correct Answer</label>
                    <select
                      value={liveQuiz.correct}
                      onChange={(e) => setLiveQuiz({ ...liveQuiz, correct: parseInt(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {liveQuiz.options.map((option, index) => (
                        <option key={index} value={index}>
                          Option {index + 1}: {option || "Enter option"}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {liveQuizError && (
                    <div className="text-red-600 text-sm">{liveQuizError}</div>
                  )}
                  
                  {liveQuizSuccess && (
                    <div className="text-green-600 text-sm">Live quiz updated successfully!</div>
                  )}
                  
                  <Button type="submit" disabled={liveQuizLoading}>
                    {liveQuizLoading ? "Updating..." : "Update Live Quiz"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Quiz Management</h2>
                <p className="text-gray-600">Create and manage scheduled quizzes</p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Quiz</DialogTitle>
                    <DialogDescription>
                      Add a new quiz to the system
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleNewQuizSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Quiz title"
                        value={newQuiz.title}
                        onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Difficulty</label>
                      <select
                        value={newQuiz.difficulty}
                        onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input
                          type="date"
                          value={newQuiz.date}
                          onChange={(e) => setNewQuiz({ ...newQuiz, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Time</label>
                        <Input
                          type="time"
                          value={newQuiz.time}
                          onChange={(e) => setNewQuiz({ ...newQuiz, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Prize</label>
                      <Input
                        placeholder="Prize description"
                        value={newQuiz.prize}
                        onChange={(e) => setNewQuiz({ ...newQuiz, prize: e.target.value })}
                      />
                    </div>
                    
                    {quizSubmitError && (
                      <div className="text-red-600 text-sm">{quizSubmitError}</div>
                    )}
                    
                    <Button type="submit" disabled={quizSubmitting} className="w-full">
                      {quizSubmitting ? "Creating..." : "Create Quiz"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                {quizLoading ? (
                  <div className="text-center py-8">Loading quizzes...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Questions</TableHead>
                        <TableHead>Prize</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quizzes.map((quiz) => (
                        <TableRow key={quiz._id}>
                          <TableCell className="font-medium">{quiz.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{quiz.difficulty}</Badge>
                          </TableCell>
                          <TableCell>{quiz.date} at {quiz.time}</TableCell>
                          <TableCell>{quiz.questionCount}</TableCell>
                          <TableCell>{quiz.prize}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleManageQuestions(quiz._id)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Manage Questions
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditQuiz(quiz._id)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteQuiz(quiz._id)}>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">John Doe</TableCell>
                      <TableCell>john@example.com</TableCell>
                      <TableCell>
                        <Badge variant="outline">User</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quiz Participation</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89%</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.5%</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+23 from last hour</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Load</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24%</div>
                  <p className="text-xs text-muted-foreground">Optimal performance</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Server Response Time</span>
                      <span>45ms</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Database Performance</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Questions Dialog */}
      <Dialog open={questionsDialogOpen} onOpenChange={setQuestionsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Quiz Questions</DialogTitle>
            <DialogDescription>
              Add, edit, or remove questions for this quiz
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Add New Question Form */}
            <form onSubmit={handleAddQuestion} className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">Add New Question</h3>
              <div>
                <label className="text-sm font-medium">Question</label>
                <Textarea
                  placeholder="Enter the question..."
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {newQuestion.options.map((option, index) => (
                  <div key={index}>
                    <label className="text-sm font-medium">Option {index + 1}</label>
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                    />
                  </div>
                ))}
              </div>
              
              <div>
                <label className="text-sm font-medium">Correct Answer</label>
                <select
                  value={newQuestion.correct}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correct: parseInt(e.target.value) })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {newQuestion.options.map((option, index) => (
                    <option key={index} value={index}>
                      Option {index + 1}: {option || "Enter option"}
                    </option>
                  ))}
                </select>
              </div>
              
              {questionError && (
                <div className="text-red-600 text-sm">{questionError}</div>
              )}
              
              <Button type="submit" disabled={questionSubmitting}>
                {questionSubmitting ? "Adding..." : "Add Question"}
              </Button>
            </form>

            {/* Existing Questions */}
            <div>
              <h3 className="font-medium mb-4">Existing Questions ({quizQuestions.length})</h3>
              <div className="space-y-4">
                {quizQuestions.map((question, index) => (
                  <div key={question._id || index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm mb-3">{question.question}</p>
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`text-sm p-2 rounded ${
                            optIndex === question.correct
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100"
                          }`}
                        >
                          {optIndex + 1}. {option}
                          {optIndex === question.correct && (
                            <span className="ml-2 text-xs">✓ Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
