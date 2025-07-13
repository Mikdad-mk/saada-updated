"use client";

import { useAuth } from "@/hooks/useAuth";

export default function TestSimplePage() {
  const { isAuthenticated, user, status } = useAuth();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      <div className="space-y-4">
        <p>Status: {status}</p>
        <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
        {user && (
          <div>
            <p>User: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        )}
      </div>
    </div>
  );
} 