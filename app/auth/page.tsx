"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: signupForm.email,
      password: signupForm.password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setIsLoading(false);
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        setError("Google authentication failed");
      }

      // Supabase will handle the redirect and callback.
    } catch (err) {
      setError("Google authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-cyan-500" />
            <h1 className="text-2xl font-bold tracking-tight">Kaitanna</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome to your emotional companion
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login"> Login</TabsTrigger>
            <TabsTrigger value="signup"> Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back </CardTitle>
                <CardDescription>
                  Sign in to continue your emotional journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full text-white bg-cyan-500"
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleAuth}
                  >
                    Continue with Google
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Join Kaitanna </CardTitle>
                <CardDescription>
                  Create an account and start connecting with your emotions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full text-white bg-cyan-500"
                  >
                    {isLoading ? "Loading..." : "Sign Up"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
