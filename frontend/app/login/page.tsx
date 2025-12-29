"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThreeBackground } from "@/components/three-background";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      toast.error("Invalid credentials");
      return;
    }

    toast.success("Welcome back!");

    // Role based redirect from backend
    if (result.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/employee/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <ThreeBackground />
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
          <span className="text-2xl font-bold mb-1">
            ProU-
            <span className="text-primary">EMS</span>
          </span>
          <span className="text-xs text-muted-foreground">
            Employee Management System
          </span>
        </div>
        <div className="bg-card border border-border rounded-xl shadow-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold mb-1">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span>Sign In</span>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <span className="text-xs text-muted-foreground">New employee?</span>
            <Link href="/register">
              <Button
                variant="outline"
                className="w-full mt-2 transition-colors duration-200 hover:bg-emerald-500 hover:text-white border-emerald-500"
              >
                Create Employee Account
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
