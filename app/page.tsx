import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  TrendingUp,
  BookOpen,
  Target,
  Sparkles,
  Heart,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-cyan-500" />
            <h1 className="text-xl font-bold tracking-tight">Kaitanna</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                Get Started
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        <section className="flex flex-col items-center justify-center text-center mb-12">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage
              src="/app_logo.svg?height=128&width=128"
              alt="Kaitanna"
            />
            <AvatarFallback className="bg-cyan-500 text-white text-2xl">
              K
            </AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome to Kaitanna
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-6">
            Your personal mood tracker and emotional wellness journal
          </p>

          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <Badge
              variant="outline"
              className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
            >
              Mood Tracking
            </Badge>
            <Badge
              variant="outline"
              className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
            >
              Personal Journal
            </Badge>
            <Badge
              variant="outline"
              className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
            >
              Emotional Insights
            </Badge>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">
            About Kaitanna
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Kaitanna is your personal emotional wellness companion designed to
              help you understand and track your emotional patterns over time.
              Through daily mood tracking and reflective journaling, you&apos;ll
              gain valuable insights into what affects your emotional
              well-being.
            </p>
            <p>
              Our platform combines the simplicity of mood tracking with the
              depth of personal journaling, creating a comprehensive tool for
              emotional self-awareness. Whether you&apos;re looking to identify
              patterns, work through challenges, or simply maintain better
              emotional health, Kaitanna provides the structure and insights you
              need.
            </p>
            <p>
              With beautiful visualizations, trend analysis, and private
              journaling features, Kaitanna helps you build a deeper
              understanding of your emotional landscape and supports your
              journey toward better mental wellness.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">
            How Kaitanna Helps You
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <BarChart3 className="h-6 w-6 text-cyan-500 mb-2" />
                <CardTitle>Mood Tracking</CardTitle>
                <CardDescription>
                  Simple daily emotional check-ins
                </CardDescription>
              </CardHeader>
              <CardContent>
                Track your emotions with our intuitive mood selector. Choose
                from a wide range of emotions and add personal notes to capture
                the full context of your feelings.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <BookOpen className="h-6 w-6 text-cyan-500 mb-2" />
                <CardTitle>Personal Journal</CardTitle>
                <CardDescription>
                  Reflect and process your thoughts
                </CardDescription>
              </CardHeader>
              <CardContent>
                Use our journaling features to dive deeper into your emotions,
                explore your thoughts, and process your experiences in a
                private, secure space.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <TrendingUp className="h-6 w-6 text-cyan-500 mb-2" />
                <CardTitle>Pattern Recognition</CardTitle>
                <CardDescription>
                  Discover your emotional patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                Visualize your emotional trends over time with beautiful charts
                and analytics that help you identify patterns, triggers, and
                positive influences in your life.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Calendar className="h-6 w-6 text-cyan-500 mb-2" />
                <CardTitle>Daily Insights</CardTitle>
                <CardDescription>
                  Build consistent self-awareness habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                Develop a daily practice of emotional awareness with gentle
                reminders, streak tracking, and insights that help you stay
                connected to your emotional well-being.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Target className="h-6 w-6 text-cyan-500 mb-2" />
                <CardTitle>Goal Setting</CardTitle>
                <CardDescription>
                  Work toward emotional wellness goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                Set personal emotional wellness goals, track your progress, and
                celebrate milestones on your journey toward better mental health
                and self-understanding.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Sparkles className="h-6 w-6 text-cyan-500 mb-2" />
                <CardTitle>Privacy First</CardTitle>
                <CardDescription>
                  Your thoughts remain completely private
                </CardDescription>
              </CardHeader>
              <CardContent>
                All your mood data and journal entries are encrypted and
                private. Your emotional journey is yours alone, and we&apos;re
                committed to keeping it that way.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">
            Your Emotional Wellness Journey
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Track Daily Moods</h3>
              <p className="text-muted-foreground">
                Quick daily check-ins help you stay aware of your emotional
                state and build a comprehensive picture of your emotional
                patterns over time.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">
                Reflect Through Journaling
              </h3>
              <p className="text-muted-foreground">
                Process your thoughts and experiences through guided journaling
                prompts and free-form writing that helps you understand your
                emotions better.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Discover Patterns</h3>
              <p className="text-muted-foreground">
                Beautiful visualizations and analytics help you identify what
                influences your mood, when you feel your best, and what
                challenges you face.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Build Better Habits</h3>
              <p className="text-muted-foreground">
                Use insights from your tracking to build healthier emotional
                habits, set meaningful goals, and create positive changes in
                your daily life.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Celebrate Progress</h3>
              <p className="text-muted-foreground">
                Track your emotional wellness journey with streak counters,
                milestone celebrations, and progress indicators that keep you
                motivated.
                <Link
                  href="/auth"
                  className="ml-1 text-cyan-500 hover:underline"
                >
                  Start your journey today
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-cyan-50 dark:bg-cyan-900/20 p-8 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why Emotional Tracking Matters
            </h2>
            <p className="text-lg">
              &quot;Understanding your emotions is the first step toward
              emotional wellness. By tracking your moods and reflecting on your
              experiences, you develop greater self-awareness, identify what
              truly matters to you, and build resilience for life&apos;s
              challenges. Kaitanna provides the tools and insights to support
              this important journey of self-discovery.&quot;
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kaitanna. Your mood tracking companion.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for emotional wellness and self-discovery
          </p>
        </div>
      </footer>
    </div>
  );
}
