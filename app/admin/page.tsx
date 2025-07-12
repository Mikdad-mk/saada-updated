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
} from "lucide-react"
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const { data: session, status } = useSession();
  const router = useRouter();

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
      // For simplicity, we're just removing it from the UI
      // In a real app, you'd make an API call to delete it from the database
      setQuizQuestions(quizQuestions.filter(q => q._id !== questionId));
      
      // Update the quiz's question count in the UI
      setQuizzes(quizzes.map(q => 
        q._id === currentQuizId ? {...q, questionCount: Math.max(0, (q.questionCount || 0) - 1)} : q
      ));
    } catch (error: any) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question");
    }
  }

  function handleEditQuiz(quizId: string) {
    alert("Edit quiz functionality would be implemented here");
  }

  async function handleDeleteQuiz(quizId: string) {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    
    try {
      // For simplicity, we're just removing it from the UI
      // In a real app, you'd make an API call to delete it from the database
      setQuizzes(quizzes.filter(q => q._id !== quizId));
    } catch (error: any) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz");
    }
  }

  // Conditional rendering instead of early returns
  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    router.push("/login");
    return null;
  }
  if (session.user?.email !== "admin@saada.com") {
    return <div>Access denied. You are not an admin.</div>;
  }

  const dashboardStats = [
    { label: "Total Users", value: "2,450", change: "+12%", icon: Users, color: "text-blue-600" },
    { label: "Active Wings", value: "11", change: "+1", icon: Shield, color: "text-green-600" },
    { label: "Blog Posts", value: "156", change: "+8", icon: FileText, color: "text-purple-600" },
    { label: "Quiz Participants", value: "890", change: "+23%", icon: Activity, color: "text-orange-600" },
  ]

  const recentUsers = [
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      role: "Student",
      status: "Active",
      joinDate: "2025-01-15",
    },
    {
      id: 2,
      name: "Fatima Ali",
      email: "fatima@example.com",
      role: "Student",
      status: "Active",
      joinDate: "2025-01-14",
    },
    {
      id: 3,
      name: "Omar Khalil",
      email: "omar@example.com",
      role: "Wing Leader",
      status: "Active",
      joinDate: "2025-01-13",
    },
    {
      id: 4,
      name: "Aisha Rahman",
      email: "aisha@example.com",
      role: "Student",
      status: "Pending",
      joinDate: "2025-01-12",
    },
  ]

  const blogPosts = [
    {
      id: 1,
      title: "Student Life at SA'ADA",
      author: "Ahmed Hassan",
      status: "Published",
      date: "2025-01-15",
      views: 245,
    },
    {
      id: 2,
      title: "Cultural Diversity in Education",
      author: "Fatima Ali",
      status: "Draft",
      date: "2025-01-14",
      views: 0,
    },
    { id: 3, title: "Leadership Development", author: "Omar Khalil", status: "Review", date: "2025-01-13", views: 189 },
    {
      id: 4,
      title: "Academic Excellence Tips",
      author: "Aisha Rahman",
      status: "Published",
      date: "2025-01-12",
      views: 312,
    },
  ]

  const wings = [
    { id: 1, name: "Media Wing", leader: "Hassan Ahmed", members: 25, status: "Active", activities: 12 },
    { id: 2, name: "Medical Wing", leader: "Mariam Said", members: 18, status: "Active", activities: 8 },
    { id: 3, name: "Discourse Hub", leader: "Yusuf Ibrahim", members: 22, status: "Active", activities: 15 },
    { id: 4, name: "English Club", leader: "Zainab Malik", members: 30, status: "Active", activities: 10 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage SA'ADA Students' Union website and activities</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 gap-1 lg:w-auto lg:grid-cols-6">
            <TabsTrigger
              value="dashboard"
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm p-2"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Dash</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm p-2"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm p-2"
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Content</span>
              <span className="sm:hidden">Posts</span>
            </TabsTrigger>
            <TabsTrigger
              value="wings"
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm p-2"
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Wings</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm p-2"
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm p-2"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
            <TabsTrigger
              value="quizzes"
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm p-2"
            >
              <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Quizzes</span>
              <span className="sm:hidden">Quiz</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Live Quiz Control</CardTitle>
                <CardDescription>Set the current live quiz question and options for participants.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLiveQuizSubmit} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Quiz Question"
                    value={liveQuiz.question}
                    onChange={e => setLiveQuiz(q => ({ ...q, question: e.target.value }))}
                    required
                  />
                  {liveQuiz.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 mt-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={liveQuiz.correct === idx}
                        onChange={() => setLiveQuiz(q => ({ ...q, correct: idx }))}
                        className="accent-blue-600"
                      />
                      <Input
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={e => setLiveQuiz(q => ({ ...q, options: q.options.map((o, i) => i === idx ? e.target.value : o) }))}
                        required
                      />
                      {liveQuiz.options.length > 2 && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => setLiveQuiz(q => ({ ...q, options: q.options.filter((_, i) => i !== idx), correct: q.correct === idx ? 0 : q.correct > idx ? q.correct - 1 : q.correct }))}>
                          Remove
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">Correct</span>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setLiveQuiz(q => ({ ...q, options: [...q.options, ""] }))}>
                      Add Option
                    </Button>
                    {liveQuiz.options.length > 2 && (
                      <Button type="button" variant="destructive" onClick={() => setLiveQuiz(q => ({ ...q, options: q.options.slice(0, -1) }))}>
                        Remove Option
                      </Button>
                    )}
                  </div>
                  <Button type="submit" disabled={liveQuizLoading} className="w-full">
                    {liveQuizLoading ? "Saving..." : "Set Live Quiz"}
                  </Button>
                  {liveQuizSuccess && <div className="text-green-600 text-sm mt-2">Live quiz updated!</div>}
                  {liveQuizError && <div className="text-red-600 text-sm mt-2">{liveQuizError}</div>}
                </form>
              </CardContent>
            </Card>
            {/* Stats Cards */}
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              {dashboardStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${stat.color}`}
                      >
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Registrations</CardTitle>
                  <CardDescription>Latest users who joined the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.slice(0, 4).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Blog Posts</CardTitle>
                  <CardDescription>Latest content submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 4).map((post) => (
                      <div key={post.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{post.title}</p>
                            <p className="text-xs text-gray-600">by {post.author}</p>
                          </div>
                        </div>
                        <Badge variant={post.status === "Published" ? "default" : "secondary"}>{post.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account for the platform</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Full Name" />
                    <Input placeholder="Email Address" type="email" />
                    <Input placeholder="Phone Number" />
                    <select className="w-full p-2 border rounded-md">
                      <option>Select Role</option>
                      <option>Student</option>
                      <option>Wing Leader</option>
                      <option>Admin</option>
                    </select>
                    <Button className="w-full">Create User</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Content Management</h2>
              <div className="flex space-x-4">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Manage News
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{post.author}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                post.status === "Published"
                                  ? "default"
                                  : post.status === "Draft"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {post.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{post.date}</TableCell>
                          <TableCell>{post.views}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Post
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Post
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wings Tab */}
          <TabsContent value="wings" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Wings Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Wing
              </Button>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wings.map((wing) => (
                <Card key={wing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{wing.name}</CardTitle>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <CardDescription>Led by {wing.leader}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Members</p>
                        <p className="font-semibold">{wing.members}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Activities</p>
                        <p className="font-semibold">{wing.activities}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Website Traffic</h3>
                  <p className="text-2xl font-bold text-gray-800">12,450</p>
                  <p className="text-sm text-green-600">+15% this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Active Users</h3>
                  <p className="text-2xl font-bold text-gray-800">2,450</p>
                  <p className="text-sm text-green-600">+8% this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Blog Engagement</h3>
                  <p className="text-2xl font-bold text-gray-800">89%</p>
                  <p className="text-sm text-green-600">+3% this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Quiz Participation</h3>
                  <p className="text-2xl font-bold text-gray-800">890</p>
                  <p className="text-sm text-green-600">+23% this month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>Comprehensive website and user analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Analytics charts would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Website Settings</span>
                  </CardTitle>
                  <CardDescription>Configure general website settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Site Title</label>
                    <Input defaultValue="SA'ADA STUDENTS' UNION" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Site Description</label>
                    <Textarea defaultValue="Empowering Students through Unity and Knowledge" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Email</label>
                    <Input defaultValue="info@saadaunion.edu" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                  <CardDescription>Manage security and access controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Enable 2FA for admin accounts</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Password Policy</h4>
                      <p className="text-sm text-gray-600">Enforce strong passwords</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Session Timeout</h4>
                      <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Set Time
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Database Management</span>
                  </CardTitle>
                  <CardDescription>Backup and maintenance tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Database Backup</h4>
                      <p className="text-sm text-gray-600">Last backup: 2 hours ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Backup Now
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">System Maintenance</h4>
                      <p className="text-sm text-gray-600">Optimize database performance</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Run Maintenance
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email Settings</span>
                  </CardTitle>
                  <CardDescription>Configure email notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">SMTP Server</label>
                    <Input placeholder="smtp.example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">SMTP Port</label>
                    <Input placeholder="587" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">From Email</label>
                    <Input placeholder="noreply@saadaunion.edu" />
                  </div>
                  <Button>Save Email Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Quiz Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Quiz</DialogTitle>
                    <DialogDescription>Add a new quiz event to the platform</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleNewQuizSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Quiz Title</label>
                      <Input 
                        placeholder="Weekly General Knowledge" 
                        value={newQuiz.title} 
                        onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Difficulty</label>
                      <select 
                        className="w-full p-2 border rounded-md" 
                        value={newQuiz.difficulty}
                        onChange={(e) => setNewQuiz({...newQuiz, difficulty: e.target.value})}
                        required
                      >
                        <option value="">Select Difficulty</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <Input 
                          type="date" 
                          value={newQuiz.date}
                          onChange={(e) => setNewQuiz({...newQuiz, date: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Time</label>
                        <Input 
                          type="time" 
                          value={newQuiz.time}
                          onChange={(e) => setNewQuiz({...newQuiz, time: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Prize</label>
                      <Input 
                        placeholder="Certificate + Badge" 
                        value={newQuiz.prize}
                        onChange={(e) => setNewQuiz({...newQuiz, prize: e.target.value})}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={quizSubmitting}>
                      {quizSubmitting ? "Creating..." : "Create Quiz"}
                    </Button>
                    {quizSubmitError && <p className="text-red-500 text-sm">{quizSubmitError}</p>}
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Quiz List */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Quizzes</CardTitle>
                <CardDescription>Manage scheduled quiz events</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Questions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quizzes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No quizzes found. Create your first quiz!
                          </TableCell>
                        </TableRow>
                      ) : (
                        quizzes.map((quiz: Quiz) => (
                          <TableRow key={quiz._id}>
                            <TableCell className="font-medium">{quiz.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{quiz.difficulty}</Badge>
                            </TableCell>
                            <TableCell>{quiz.date}</TableCell>
                            <TableCell>{quiz.time}</TableCell>
                            <TableCell>{quiz.questionCount || 0}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => handleManageQuestions(quiz._id)}>
                                  <Plus className="w-3 h-3 mr-1" />
                                  Questions
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleEditQuiz(quiz._id)}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Quiz
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteQuiz(quiz._id)}>
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Quiz
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Question Management Dialog */}
            <Dialog open={questionsDialogOpen} onOpenChange={setQuestionsDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Manage Quiz Questions</DialogTitle>
                  <DialogDescription>Add or edit questions for this quiz</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Question List */}
                  <div className="max-h-[300px] overflow-y-auto border rounded-md">
                    {quizQuestions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No questions added yet. Add your first question below.
                      </div>
                    ) : (
                      <div className="divide-y">
                        {quizQuestions.map((q: Question, idx: number) => (
                          <div key={q._id || idx} className="p-3 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{q.question}</p>
                                <div className="mt-1 text-sm text-gray-600">
                                  {q.options.map((opt: string, i: number) => (
                                    <span key={i} className={i === q.correct ? "text-green-600 font-medium" : ""}>
                                      {i + 1}. {opt}{i === q.correct ? " ✓" : ""}{i < q.options.length - 1 ? ", " : ""}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(q._id || idx)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Question Form */}
                  <form onSubmit={handleAddQuestion} className="space-y-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Question</label>
                      <Input 
                        placeholder="What is the capital of France?" 
                        value={newQuestion.question} 
                        onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})} 
                        required 
                      />
                    </div>
                    {newQuestion.options.map((opt: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct"
                          checked={newQuestion.correct === idx}
                          onChange={() => setNewQuestion({...newQuestion, correct: idx})}
                          className="accent-blue-600"
                          required
                        />
                        <Input
                          placeholder={`Option ${idx + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const updatedOptions = [...newQuestion.options];
                            updatedOptions[idx] = e.target.value;
                            setNewQuestion({...newQuestion, options: updatedOptions});
                          }}
                          required
                        />
                        {newQuestion.options.length > 2 && (
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => {
                              const updatedOptions = newQuestion.options.filter((_, i) => i !== idx);
                              const updatedCorrect = newQuestion.correct === idx ? 0 : 
                                                    newQuestion.correct > idx ? newQuestion.correct - 1 : newQuestion.correct;
                              setNewQuestion({...newQuestion, options: updatedOptions, correct: updatedCorrect});
                            }}
                          >
                            Remove
                          </Button>
                        )}
                        <span className="text-xs text-muted-foreground">Correct</span>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setNewQuestion({...newQuestion, options: [...newQuestion.options, ""]})}
                      >
                        Add Option
                      </Button>
                    </div>
                    <div className="flex justify-between pt-2">
                      <Button type="button" variant="outline" onClick={() => setQuestionsDialogOpen(false)}>
                        Done
                      </Button>
                      <Button type="submit" disabled={questionSubmitting}>
                        {questionSubmitting ? "Adding..." : "Add Question"}
                      </Button>
                    </div>
                  </form>
                  {questionError && <div className="text-red-600 text-sm mt-2">{questionError}</div>}
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
