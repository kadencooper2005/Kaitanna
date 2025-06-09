"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  LogOut,
  BarChart3,
  MessageCircle,
  Database,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function ChatPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }
    setIsLoading(false);
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 text-cyan-500 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">
            Loading your chat with Kaitanna...
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-cyan-500" />
            <Link
              href="/dashboard"
              className="text-xl font-bold tracking-tight hover:text-cyan-500 transition-colors"
            >
              Kaitanna
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-cyan-500 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/mood-tracker"
              className="text-sm font-medium hover:text-cyan-500 transition-colors"
            >
              Mood Tracker
            </Link>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-cyan-500" />
              <span className="font-medium">Chat</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Chat with Kaitanna
          </h1>
          <p className="text-muted-foreground">
            Your emotional companion is here to listen, understand, and support
            you
          </p>
        </div>

        {/* Main Chat Interface */}
        <ChatInterface />

        {/* Simple Info Section */}
        <div className="mt-6">
          <Card className="bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-cyan-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Powered by Supabase for real-time messaging and secure data
                    storage. Your conversations are private and always
                    available.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/mood-tracker">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Mood Tracker
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
