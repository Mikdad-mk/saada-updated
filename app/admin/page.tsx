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
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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

// Add this helper for sortable items
function SortableItem({ id, children, ...props }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: isDragging ? '#f3f4f6' : undefined,
      }}
      {...attributes}
      {...props}
    >
      <span {...listeners} style={{ cursor: 'grab', marginRight: 8, display: 'inline-block' }}>
        <GripVertical className="inline w-4 h-4 text-gray-400" />
      </span>
      {children}
    </div>
  );
}

export default function AdminPage() {
  // All hooks at the top!
  const { user, isAuthenticated, isAdmin, canAccessAdmin, status } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  // Add this for dnd-kit sensors
  const sensors = useSensors(useSensor(PointerSensor));

  const [activeTab, setActiveTab] = useState("dashboard");
  const [liveQuiz, setLiveQuiz] = useState({ question: "", options: ["", ""], correct: 0 });
  const [liveQuizLoading, setLiveQuizLoading] = useState(false);
  const [liveQuizSuccess, setLiveQuizSuccess] = useState(false);
  const [liveQuizError, setLiveQuizError] = useState("");
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizLoading, setQuizLoading] = useState(true);
  const [newQuiz, setNewQuiz] = useState({ title: "", difficulty: "Easy", date: "", time: "", prize: "" });
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizSubmitError, setQuizSubmitError] = useState("");

  const [questionsDialogOpen, setQuestionsDialogOpen] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Question>({ question: "", options: ["", ""], correct: 0 });
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [questionError, setQuestionError] = useState("");

  // Add state for live quiz update feedback
  const [liveQuizUpdateLoading, setLiveQuizUpdateLoading] = useState(false);
  const [liveQuizUpdateError, setLiveQuizUpdateError] = useState("");
  const [liveQuizUpdateSuccess, setLiveQuizUpdateSuccess] = useState("");

  useEffect(() => {
    async function fetchLiveQuiz() {
      const res = await fetch("/api/current-quiz");
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

  // Debug log for quizzes array
  useEffect(() => {
    if (quizzes.length) {
      console.log("Loaded quizzes:", quizzes);
    }
  }, [quizzes]);

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
    const res = await fetch("/api/current-quiz", {
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

    // Robust validation for required fields
    if (!newQuiz.title.trim()) {
      setQuizSubmitError("Quiz title is required.");
      setQuizSubmitting(false);
      return;
    }
    if (!newQuiz.difficulty.trim()) {
      setQuizSubmitError("Quiz difficulty is required.");
      setQuizSubmitting(false);
      return;
    }
    if (!newQuiz.date.trim()) {
      setQuizSubmitError("Quiz date is required.");
      setQuizSubmitting(false);
      return;
    }
    if (!newQuiz.time.trim()) {
      setQuizSubmitError("Quiz time is required.");
      setQuizSubmitting(false);
      return;
    }
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
    // Robust validation
    if (!currentQuizId || typeof currentQuizId !== "string" || !currentQuizId.trim()) {
      setQuestionError("No quiz selected. Please select a quiz before adding questions.");
      setQuestionSubmitting(false);
      return;
    }
    if (!newQuestion.question.trim()) {
      setQuestionError("Question text cannot be empty.");
      setQuestionSubmitting(false);
      return;
    }
    if (!Array.isArray(newQuestion.options) || newQuestion.options.length < 2) {
      setQuestionError("Please provide at least two options.");
      setQuestionSubmitting(false);
      return;
    }
    if (newQuestion.options.some(opt => !opt.trim())) {
      setQuestionError("All options must be non-empty.");
      setQuestionSubmitting(false);
      return;
    }
    if (
      typeof newQuestion.correct !== "number" ||
      newQuestion.correct < 0 ||
      newQuestion.correct >= newQuestion.options.length ||
      !newQuestion.options[newQuestion.correct].trim()
    ) {
      setQuestionError("Please select a valid correct answer.");
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
      // Log the data being sent for debugging
      console.log("Submitting question data:", questionData);
      const res = await fetch("/api/quiz/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });
      // Log the response for debugging
      const resJson = await res.json();
      console.log("/api/quiz/questions response:", res.status, resJson);
      if (!res.ok) {
        setQuestionError(resJson.error || "Failed to add question");
        setQuestionSubmitting(false);
        return;
      }
      // Update local state with frontend type
      setQuizQuestions(prevQuestions => [
        ...prevQuestions,
        {
          _id: resJson.id,
          question: newQuestion.question,
          options: newQuestion.options,
          correct: newQuestion.correct
        }
      ]);
      setNewQuestion({ question: "", options: ["", ""], correct: 0 });
    } catch (error: any) {
      console.error("Error adding question:", error);
      setQuestionError(error.message || "Failed to add question");
    } finally {
      setQuestionSubmitting(false);
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (!questionId) return;
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

  // Function to set a quiz as live
  async function handleSetQuizAsLive(quizId: string) {
    setLiveQuizUpdateLoading(true);
    setLiveQuizUpdateError("");
    setLiveQuizUpdateSuccess("");
    try {
      // Extra logging for quizId
      console.log("handleSetQuizAsLive called with quizId:", quizId);
      if (!quizId || typeof quizId !== "string" || !quizId.trim()) {
        setLiveQuizUpdateError("Quiz ID is missing or invalid. Cannot set quiz as live.");
        setLiveQuizUpdateLoading(false);
        return;
      }
      // Find the quiz and its questions
      const quiz = quizzes.find(q => q._id === quizId);
      if (!quiz) throw new Error("Quiz not found");
      // Fetch questions for this quiz
      const res = await fetch(`/api/quiz/questions?quizId=${quizId}`);
      if (!res.ok) throw new Error("Failed to fetch questions for quiz");
      const questionsRaw = await res.json();
      // Convert to backend format
      const questions = questionsRaw.map((q: any) => ({
        text: q.text || q.question,
        options: q.options,
        answer: typeof q.answer === "number" ? q.answer : q.correct
      }));
      // Robust validation
      if (!questions.length) {
        setLiveQuizUpdateError("Quiz must have at least one question to be set as live.");
        setLiveQuizUpdateLoading(false);
        return;
      }
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.text || !Array.isArray(q.options) || q.options.length < 2) {
          setLiveQuizUpdateError(`Question ${i + 1} is missing text or has less than 2 options.`);
          setLiveQuizUpdateLoading(false);
          return;
        }
        if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.options.length) {
          setLiveQuizUpdateError(`Question ${i + 1} has an invalid correct answer index.`);
          setLiveQuizUpdateLoading(false);
          return;
        }
        if (!q.options[q.answer] || !q.options[q.answer].trim()) {
          setLiveQuizUpdateError(`Question ${i + 1} has an empty correct answer option.`);
          setLiveQuizUpdateLoading(false);
          return;
        }
      }
      // Log the payload for debugging
      console.log("Setting quiz as live. Payload:", { quizId, questions });
      // Send POST to /api/live-quiz
      const postRes = await fetch("/api/current-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, questions }),
      });
      // Log the response for debugging
      const postResJson = await postRes.json();
      console.log("/api/current-quiz response:", postRes.status, postResJson);
      if (!postRes.ok) {
        setLiveQuizUpdateError(postResJson.error || "Failed to set live quiz");
        setLiveQuizUpdateLoading(false);
        return;
      }
      setLiveQuizUpdateSuccess("Live quiz set successfully!");
    } catch (error: any) {
      setLiveQuizUpdateError(error.message || "Failed to set live quiz");
    } finally {
      setLiveQuizUpdateLoading(false);
    }
  }

  // Add option for dynamic add/remove in newQuestion
  function handleAddOption() {
    setNewQuestion((q) => ({ ...q, options: [...q.options, ''] }));
  }
  function handleRemoveOption(idx: number) {
    if (newQuestion.options.length <= 2) return;
    setNewQuestion((q) => {
      const options = q.options.filter((_, i) => i !== idx);
      let correct = q.correct;
      if (correct >= options.length) correct = 0;
      return { ...q, options, correct };
    });
  }
  function handleOptionDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setNewQuestion((q) => {
        const oldIndex = q.options.findIndex((_, i) => i === Number(active.id));
        const newIndex = q.options.findIndex((_, i) => i === Number(over.id));
        const options = arrayMove(q.options, oldIndex, newIndex);
        let correct = q.correct;
        if (oldIndex === correct) correct = newIndex;
        else if (oldIndex < correct && newIndex >= correct) correct--;
        else if (oldIndex > correct && newIndex <= correct) correct++;
        return { ...q, options, correct };
      });
    }
  }
  // For questions drag-and-drop
  function handleQuestionsDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setQuizQuestions((questions) => {
        const oldIndex = questions.findIndex((q, i) => q._id === active.id);
        const newIndex = questions.findIndex((q, i) => q._id === over.id);
        const newQuestions = arrayMove(questions, oldIndex, newIndex);
        // Persist new order to backend
        if (currentQuizId) {
          const questionIds = newQuestions.map(q => q._id);
          fetch('/api/quiz/questions', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quizId: currentQuizId, questionIds }),
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                toast({ title: 'Questions reordered', description: 'The order has been saved.' });
              } else {
                toast({ title: 'Error', description: data.error || 'Failed to save order', variant: 'destructive' });
              }
            })
            .catch(() => {
              toast({ title: 'Error', description: 'Failed to save order', variant: 'destructive' });
            });
        }
        return newQuestions;
      });
    }
  }

  // Now do conditional rendering
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
            <TabsTrigger value="current-quiz" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Current Quiz</span>
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

          {/* Current Quiz Tab */}
          <TabsContent value="current-quiz" className="space-y-6">
            {/* Removed broken Live Quiz form. Use the Set as Current Quiz button in the quizzes table instead. */}
            <Card>
              <CardHeader>
                <CardTitle>Current Quiz Management</CardTitle>
                <CardDescription>
                  Use the "Set as Current Quiz" button in the quizzes table to activate a quiz for users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600">To run a quiz, first add questions to a quiz, then use the Set as Current Quiz action in the quizzes table below.</div>
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
                    
                    <Button type="submit" disabled={quizSubmitting || !newQuiz.title.trim() || !newQuiz.difficulty.trim() || !newQuiz.date.trim() || !newQuiz.time.trim()} className="w-full">
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
                                <DropdownMenuItem onClick={() => handleSetQuizAsLive(quiz._id)}>
                                  <Brain className="w-4 h-4 mr-2" />
                                  Set as Current Quiz
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {liveQuizUpdateError && (
                  <div className="text-red-600 text-sm mb-2">{liveQuizUpdateError}</div>
                )}
                {liveQuizUpdateSuccess && (
                  <div className="text-green-600 text-sm mb-2">{liveQuizUpdateSuccess}</div>
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
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleOptionDragEnd}>
                <SortableContext items={newQuestion.options.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {newQuestion.options.map((option, index) => (
                      <SortableItem key={index} id={index.toString()} className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={newQuestion.correct === index}
                          onChange={() => setNewQuestion({ ...newQuestion, correct: index })}
                          className="accent-blue-600"
                          aria-label={`Mark option ${index + 1} as correct`}
                        />
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newQuestion.options];
                            newOptions[index] = e.target.value;
                            setNewQuestion({ ...newQuestion, options: newOptions });
                          }}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(index)} disabled={newQuestion.options.length <= 2} aria-label="Remove option">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <Button type="button" variant="outline" onClick={handleAddOption} disabled={newQuestion.options.length >= 6}>
                <Plus className="w-4 h-4 mr-2" /> Add Option
              </Button>
              {questionError && (
                <div className="text-red-600 text-sm">{questionError}</div>
              )}
              <Button type="submit" disabled={questionSubmitting || !currentQuizId}>
                {questionSubmitting ? "Adding..." : "Add Question"}
              </Button>
            </form>
            {/* Existing Questions with drag-and-drop */}
            <h3 className="font-medium mb-4">Existing Questions ({quizQuestions.length})</h3>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleQuestionsDragEnd}>
              <SortableContext items={quizQuestions.map((q) => q._id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {quizQuestions.map((question, index) => (
                    <SortableItem key={question._id || index} id={question._id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Question {index + 1}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question._id)}
                          aria-label="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm mb-3">{question.question}</p>
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`text-sm p-2 rounded ${optIndex === question.correct ? "bg-green-100 text-green-800" : "bg-gray-100"}`}
                          >
                            {optIndex + 1}. {option}
                            {optIndex === question.correct && (
                              <span className="ml-2 text-xs">✓ Correct</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
