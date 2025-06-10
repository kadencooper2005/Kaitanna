"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoodSelector } from "@/components/mood-selector";
import { MoodCharts } from "@/components/mood-charts";
import { MoodHistory } from "@/components/mood-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, Calendar, BarChart3, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  type MoodEntry,
  getUserMoodEntries,
  addUserMoodEntry,
} from "@/lib/mood-data";

export default function MoodTrackerPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
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

  const handleMoodSelect = async (mood: string) => {
    if (!user) return;

    try {
      await addUserMoodEntry(user.id, mood);
      // Refresh mood entries after adding new one
      const updatedMoods = getUserMoodEntries(user.id);
      setMoodEntries(updatedMoods);
    } catch (error) {
      console.error("Error adding mood entry:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 text-cyan-500 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">
            Loading your emotional journey...
          </p>
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
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-500" />
              <span className="font-medium">Mood Tracker</span>
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

      <main className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            How are you feeling today, {user.username}?
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your emotions and discover patterns in your emotional
            well-being
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-cyan-500" />
                  Today&apos;s Mood
                </CardTitle>
                <CardDescription>
                  {todayEntry
                    ? `You're feeling ${todayEntry.mood.toLowerCase()} today`
                    : "How are you feeling right now?"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!todayEntry ? (
                  <MoodSelector onMoodSelect={handleMoodSelect} />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-lg mb-4">
                      You&apos;ve already logged your mood today!
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Feeling:
                      <span className="font-semibold text-cyan-500">
                        {todayEntry.mood}
                      </span>
                    </p>
                    {todayEntry.note && (
                      <p className="text-sm text-muted-foreground italic">
                        &quot;{todayEntry.note}&quot;
                      </p>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setSelectedMood("update")}
                      className="mt-4"
                    >
                      Update Today&apos;s Mood
                    </Button>
                    {selectedMood === "update" && (
                      <div className="mt-4">
                        <MoodSelector onMoodSelect={handleMoodSelect} />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="charts" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="charts" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="charts">
                <MoodCharts moodEntries={moodEntries} />
              </TabsContent>
              <TabsContent value="history">
                <MoodHistory moodEntries={moodEntries} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Your Emotional Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total entries
                    </span>
                    <span className="font-semibold">{moodEntries.length}</span>
                  </div>
                  {/* more UI here */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
