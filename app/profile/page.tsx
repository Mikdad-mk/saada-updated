"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Edit,
  Save,
  X,
  Shield,
  Bell,
  Settings,
  Activity,
  Trophy,
  Target,
  TrendingUp,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
  profile: {
    avatar: string | null;
    bio: string;
    phone: string;
    department: string;
    year: string;
    studentId: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: string;
      showEmail: boolean;
      showPhone: boolean;
    };
  };
  stats: {
    quizzesTaken: number;
    quizzesWon: number;
    totalScore: number;
    averageScore: number;
    joinDate: string;
  };
}

export default function ProfilePage() {
  const { user, isAuthenticated, status } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    
    if (!isAuthenticated) {
      router.push("/login?callbackUrl=/profile");
      return;
    }
  }, [isAuthenticated, status, router]);

  // Fetch user profile
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfile();
    }
  }, [isAuthenticated, user]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        // If no profile exists, create a default one
        setProfile({
          name: user?.name || "",
          email: user?.email || "",
          role: user?.role || "user",
          status: "active",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          profile: {
            avatar: null,
            bio: "",
            phone: "",
            department: "",
            year: "",
            studentId: "",
          },
          preferences: {
            notifications: {
              email: true,
              push: true,
              sms: false,
            },
            privacy: {
              profileVisibility: "public",
              showEmail: false,
              showPhone: false,
            },
          },
          stats: {
            quizzesTaken: 0,
            quizzesWon: 0,
            totalScore: 0,
            averageScore: 0,
            joinDate: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchUserProfile(); // Reset to original data
  };

  // Show loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile</p>
          <Button onClick={fetchUserProfile} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{profile.name}</h3>
                      <p className="text-gray-600">{profile.email}</p>
                      <Badge variant="outline" className="mt-1">
                        {profile.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span>Last login: {new Date(profile.lastLogin).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{profile.stats.quizzesTaken}</div>
                      <div className="text-sm text-gray-600">Quizzes Taken</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{profile.stats.quizzesWon}</div>
                      <div className="text-sm text-gray-600">Quizzes Won</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{profile.stats.totalScore}</div>
                      <div className="text-sm text-gray-600">Total Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{profile.stats.averageScore}%</div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Profile updated</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed quiz: General Knowledge</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Account created</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profile Information</CardTitle>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveProfile} disabled={saving}>
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? "Saving..." : "Save"}
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={profile.email}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      value={profile.profile.phone}
                      onChange={(e) => setProfile({
                        ...profile,
                        profile: { ...profile.profile, phone: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Student ID</label>
                    <Input
                      value={profile.profile.studentId}
                      onChange={(e) => setProfile({
                        ...profile,
                        profile: { ...profile.profile, studentId: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <Input
                      value={profile.profile.department}
                      onChange={(e) => setProfile({
                        ...profile,
                        profile: { ...profile.profile, department: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Year of Study</label>
                    <Input
                      value={profile.profile.year}
                      onChange={(e) => setProfile({
                        ...profile,
                        profile: { ...profile.profile, year: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    value={profile.profile.bio}
                    onChange={(e) => setProfile({
                      ...profile,
                      profile: { ...profile.profile, bio: e.target.value }
                    })}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.notifications.email}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          notifications: {
                            ...profile.preferences.notifications,
                            email: e.target.checked
                          }
                        }
                      })}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive browser notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.notifications.push}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          notifications: {
                            ...profile.preferences.notifications,
                            push: e.target.checked
                          }
                        }
                      })}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.notifications.sms}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          notifications: {
                            ...profile.preferences.notifications,
                            sms: e.target.checked
                          }
                        }
                      })}
                      className="rounded"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Profile Visibility</label>
                    <select
                      value={profile.preferences.privacy.profileVisibility}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          privacy: {
                            ...profile.preferences.privacy,
                            profileVisibility: e.target.value
                          }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Email</p>
                      <p className="text-sm text-gray-600">Allow others to see your email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.privacy.showEmail}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          privacy: {
                            ...profile.preferences.privacy,
                            showEmail: e.target.checked
                          }
                        }
                      })}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Phone</p>
                      <p className="text-sm text-gray-600">Allow others to see your phone</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.privacy.showPhone}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          privacy: {
                            ...profile.preferences.privacy,
                            showPhone: e.target.checked
                          }
                        }
                      })}
                      className="rounded"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.stats.quizzesTaken}</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quizzes Won</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.stats.quizzesWon}</div>
                  <p className="text-xs text-muted-foreground">+1 from last week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.stats.totalScore}</div>
                  <p className="text-xs text-muted-foreground">+45 from last week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.stats.averageScore}%</div>
                  <p className="text-xs text-muted-foreground">+5% from last week</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Quiz Completion Rate</span>
                      <span>{profile.stats.quizzesTaken > 0 ? Math.round((profile.stats.quizzesWon / profile.stats.quizzesTaken) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${profile.stats.quizzesTaken > 0 ? Math.round((profile.stats.quizzesWon / profile.stats.quizzesTaken) * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Average Performance</span>
                      <span>{profile.stats.averageScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${profile.stats.averageScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Total Score Progress</span>
                      <span>{profile.stats.totalScore} points</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((profile.stats.totalScore / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 