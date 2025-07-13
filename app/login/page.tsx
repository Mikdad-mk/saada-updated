"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { UserRole } from "@/app/api/auth/[...nextauth]/route";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get error from URL params (for redirects from protected routes)
  const urlError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase().trim(),
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error);
      } else if (res?.ok) {
        // Role-based redirects
        const userRole = res.url?.includes("admin") ? "admin" : "user";
        
        if (userRole === "admin" || email.toLowerCase() === "admin@saada.com") {
          router.push("/admin");
        } else {
          router.push(callbackUrl);
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleDemoLogin = async (role: UserRole) => {
    setLoading(true);
    setError("");

    let demoEmail = "";
    let demoPassword = "";

    switch (role) {
      case UserRole.ADMIN:
        demoEmail = "admin@saada.com";
        demoPassword = "Admin123!";
        break;
      case UserRole.MODERATOR:
        demoEmail = "moderator@saada.com";
        demoPassword = "Moderator123!";
        break;
      case UserRole.USER:
        demoEmail = "user@saada.com";
        demoPassword = "User123!";
        break;
    }

    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: demoEmail,
        password: demoPassword,
      });

      if (res?.error) {
        setError(res.error);
      } else if (res?.ok) {
        if (role === UserRole.ADMIN) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      setError("Demo login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <p className="text-gray-600 mt-2">Sign in to your SA'ADA Union account</p>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Error Display */}
            {(error || urlError) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error || urlError}
                </AlertDescription>
              </Alert>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Demo Login Buttons */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 text-center">Quick Demo Access:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(UserRole.ADMIN)}
                  disabled={loading}
                  className="text-xs"
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(UserRole.MODERATOR)}
                  disabled={loading}
                  className="text-xs"
                >
                  Moderator
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(UserRole.USER)}
                  disabled={loading}
                  className="text-xs"
                >
                  User
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link 
                href="/signup" 
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Sign up
              </Link>
            </div>

            <div className="text-center text-xs text-gray-500">
              <Link 
                href="/forgot-password" 
                className="hover:text-gray-700 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 