"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Home, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const { isAuthenticated, user, canAccessAdmin } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Access Denied</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              You don't have permission to access this page
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {isAuthenticated 
                ? `Sorry ${user?.name}, you don't have the required permissions to access this resource.`
                : "You need to be logged in to access this page."
              }
            </p>
            
            {isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Current Role:</strong> {user?.role}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Contact an administrator if you believe you should have access to this page.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => router.back()} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Link>
            </Button>

            {!isAuthenticated && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            )}

            {isAuthenticated && canAccessAdmin() && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin">
                  Go to Admin Panel
                </Link>
              </Button>
            )}
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>If you believe this is an error, please contact support.</p>
            <Link 
              href="/contact" 
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 