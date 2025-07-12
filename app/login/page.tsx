"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      if (email === "admin@saada.com") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background animate-fade-in">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <img src="/placeholder-logo.svg" alt="SA'ADA Logo" className="mx-auto mb-4 h-16 w-16" />
          <CardTitle>Sign in to SA'ADA Union</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            {searchParams.get("error") && <div className="text-red-600 text-sm text-center">{searchParams.get("error")}</div>}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="w-full text-center text-sm text-muted-foreground mt-2">
              Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 