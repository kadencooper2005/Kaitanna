"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  BarChart3,
  Calendar,
  TrendingUp,
  Smile,
  LogOut,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getUserMoodEntries, type MoodEntry } from "@/lib/mood-data";
import { format, subDays } from "date-fns";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    // Load user-specific mood data
    const userMoods = getUserMoodEntries(user.id);
    setMoodEntries(userMoods);
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
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  const todayEntry = moodEntries.find((entry) => {
    const today = new Date().toDateString();
    return new Date(entry.date).toDateString() === today;
  });

  const recentEntries = moodEntries
    .filter((entry) => new Date(entry.date) >= subDays(new Date(), 7))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const totalDaysTracked = new Set(
    moodEntries.map((entry) => new Date(entry.date).toDateString())
  ).size;

  const getMoodEmoji = (mood: string): string => {
    const moodEmojis: Record<string, string> = {
      Joyful: "😄",
      Excited: "🤩",
      Content: "😊",
      Grateful: "🙏",
      Peaceful: "😌",
      Loved: "🥰",
      Proud: "😤",
      Calm: "😐",
      Okay: "🙂",
      Tired: "😴",
      Bored: "😑",
      Confused: "😕",
      Sad: "😢",
      Lonely: "😔",
      Disappointed: "😞",
      Melancholy: "😪",
      Heartbroken: "💔",
      Angry: "😠",
      Frustrated: "😤",
      Irritated: "😒",
      Annoyed: "🙄",
      Anxious: "😰",
      Worried: "😟",
      Stressed: "😫",
      Overwhelmed: "🤯",
      Hopeful: "🌟",
      Curious: "🤔",
      Surprised: "😲",
    };
    return moodEmojis[mood] || "😐";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-cyan-500" />
            <span className="text-xl font-bold tracking-tight">Kaitanna</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="text-sm font-medium hover:text-cyan-500 transition-colors"
            >
              Chat
            </Link>
            <Link
              href="/mood-tracker"
              className="text-sm font-medium hover:text-cyan-500 transition-colors"
            >
              Mood Tracker
            </Link>
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

      <main className="container py-8 md:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src="/placeholder.svg?height=64&width=64"
                alt={user.username}
              />
              <AvatarFallback className="bg-cyan-500 text-white text-lg">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user.username}!
              </h1>
              <p className="text-muted-foreground">
                How are you feeling today?
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Moods Tracked
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moodEntries.length}</div>
              <p className="text-xs text-muted-foreground">
                Across {totalDaysTracked} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Mood
              </CardTitle>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {todayEntry ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {getMoodEmoji(todayEntry.mood)}
                  </span>
                  <div>
                    <div className="text-lg font-bold">{todayEntry.mood}</div>
                    <p className="text-xs text-muted-foreground">
                      Logged at {format(new Date(todayEntry.date), "h:mm a")}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-lg font-bold text-muted-foreground">
                    Not logged yet
                  </div>
                  <Link
                    href="/mood-tracker"
                    className="text-xs text-cyan-500 hover:underline"
                  >
                    Track your mood
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tracking Streak
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalDaysTracked > 0 ? "1" : "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalDaysTracked > 0 ? "Keep it up!" : "Start tracking today"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cyan-500" />
                Recent Moods
              </CardTitle>
              <CardDescription>
                Your emotional journey this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentEntries.length > 0 ? (
                <div className="space-y-3">
                  {recentEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {getMoodEmoji(entry.mood)}
                        </span>
                        <div>
                          <p className="font-medium">{entry.mood}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(entry.date), "MMM dd, h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-2">
                    No moods tracked yet
                  </p>
                  <Link href="/mood-tracker">
                    <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                      Start Tracking
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-cyan-500" />
                Emotional Wellness
              </CardTitle>
              <CardDescription>Your journey with Kaitanna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Account created</span>
                  <Badge
                    variant="outline"
                    className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                  >
                    {format(new Date(user.createdAt), "MMM dd, yyyy")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Days with Kaitanna</span>
                  <span className="font-semibold">
                    {Math.ceil(
                      (Date.now() - new Date(user.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </span>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground italic">
                    "Every emotion you track is a step toward understanding
                    yourself better. I'm here to support you on this journey,{" "}
                    {user.username}."
                  </p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-2">
                    - Kaitanna
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800 mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat with Kaitanna
              </h3>
              <p className="text-muted-foreground mb-4">
                Have a heart-to-heart conversation with your emotional
                companion. I'm here to listen and understand.
              </p>
              <Link href="/chat">
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Chatting
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                Ready to continue your emotional journey?
              </h3>
              <p className="text-muted-foreground mb-4">
                {todayEntry
                  ? "You've tracked your mood today! Explore your patterns and insights."
                  : "Track your mood for today and let me be your companion through it all."}
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/mood-tracker">
                  <Button className="bg-cyan-500 hover:bg-cyan-600">
                    {todayEntry ? "View Analytics" : "Track Today's Mood"}
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
