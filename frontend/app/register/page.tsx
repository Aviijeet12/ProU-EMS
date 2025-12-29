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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const success = await register(name, email, password);
    setIsLoading(false);

    if (success) {
      toast.success("Account created! Logging in...");
      router.push("/employee/dashboard");
    } else {
      toast.error("Registration failed");
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
            <h1 className="text-xl font-semibold mb-1">
              Create Employee Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join ProU-EMS as an employee
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium"
              >
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
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
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2"
            >
              {isLoading
                ? "Creating account..."
                : "Create Employee Account"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
