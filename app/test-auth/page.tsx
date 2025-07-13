"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TestAuthPage() {
  const { 
    session, 
    status, 
    user, 
    role, 
    isAuthenticated, 
    isAdmin, 
    isModerator, 
    isUser 
  } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test Page</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Session Status</CardTitle>
              <CardDescription>Current authentication status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Status:</p>
                <Badge variant={status === "loading" ? "secondary" : status === "authenticated" ? "default" : "destructive"}>
                  {status}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium">Authenticated:</p>
                <Badge variant={isAuthenticated ? "default" : "secondary"}>
                  {isAuthenticated ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {isAuthenticated && user && (
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Current user details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Name:</p>
                  <p className="text-sm text-gray-600">{user.name}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Role:</p>
                  <Badge variant="outline">{role}</Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Role Checks:</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                        Admin
                      </Badge>
                      <span className="text-xs text-gray-500">{isAdmin ? "✓" : "✗"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isModerator ? "default" : "secondary"} className="text-xs">
                        Moderator
                      </Badge>
                      <span className="text-xs text-gray-500">{isModerator ? "✓" : "✗"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isUser ? "default" : "secondary"} className="text-xs">
                        User
                      </Badge>
                      <span className="text-xs text-gray-500">{isUser ? "✓" : "✗"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Session Data</CardTitle>
              <CardDescription>Raw session information</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>What you can do next</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-sm">You are not authenticated. You can:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <a href="/login" className="text-blue-600 hover:underline">Sign in</a></li>
                    <li>• <a href="/signup" className="text-blue-600 hover:underline">Create an account</a></li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm">You are authenticated! You can:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <a href="/profile" className="text-blue-600 hover:underline">View your profile</a></li>
                    {isAdmin && (
                      <li>• <a href="/admin" className="text-blue-600 hover:underline">Access admin panel</a></li>
                    )}
                    <li>• <a href="/quiz" className="text-blue-600 hover:underline">Take quizzes</a></li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 