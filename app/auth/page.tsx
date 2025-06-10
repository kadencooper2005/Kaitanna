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
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // for info like "check your email"
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
    setMessage("");

    if (!supabase) {
      setError("Authentication service is not available");
      setIsLoading(false);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (loginError) {
      setError(loginError.message);
    } else {
      router.push("/dashboard");
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Authentication service is not available");
      setIsLoading(false);
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: signupForm.email,
      password: signupForm.password,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm-signup`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMessage(
        "Signup successful! Please check your email to confirm your account."
      );
      setSignupForm({ email: "", password: "", confirmPassword: "" });
    }
    setIsLoading(false);
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Authentication service is not available");
      setIsLoading(false);
      return;
    }

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (googleError) {
        setError(googleError.message);
      }
      // Redirect and callback handled by Supabase automatically
    } catch (error) {
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
                      required
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
                      required
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full text-white bg-cyan-500"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
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
                      required
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
                      required
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
                      required
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {message && (
                    <p className="text-green-600 text-sm">{message}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full text-white bg-cyan-500"
                    disabled={isLoading}
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
