"use client";
import { Suspense } from "react";
import React from "react";

function LoginForm() {
  const { signIn } = require("next-auth/react");
  const { useState } = require("react");
  const { useRouter, useSearchParams } = require("next/navigation");
  const Link = require("next/link").default;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

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
        if (email.toLowerCase() === "admin@saada.com") {
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

  const handleDemoLogin = async (role: string) => {
    setLoading(true);
    setError("");
    let demoEmail = "";
    let demoPassword = "";
    switch (role) {
      case "admin":
        demoEmail = "admin@saada.com";
        demoPassword = "Admin123!";
        break;
      case "moderator":
        demoEmail = "moderator@saada.com";
        demoPassword = "Moderator123!";
        break;
      case "user":
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
        if (role === "admin") {
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
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border-0 p-6">
        <div className="text-center space-y-4 mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your SA'ADA Union account</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {(error || urlError) && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error || urlError}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-11"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 text-center">Quick Demo Access:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={loading}
                  className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("moderator")}
                  disabled={loading}
                  className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Moderator
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("user")}
                  disabled={loading}
                  className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  User
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline font-medium">Sign up</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
} 