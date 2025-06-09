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
import { Heart, MessageCircle, Smile, Coffee, Sparkles } from "lucide-react";
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
              src="/placeholder.svg?height=128&width=128"
              alt="Kaitanna"
            />
            <AvatarFallback className="bg-cyan-500 text-white text-2xl">
              K
            </AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Hi, I'm Kaitanna
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-6">
            Your digital best friend, here for you whenever you need someone to
            talk to
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
              Start Your Journey
            </Button>
          </Link>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <Badge
              variant="outline"
              className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
            >
              Emotional Companion
            </Badge>
            <Badge
              variant="outline"
              className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
            >
              Always Listening
            </Badge>
            <Badge
              variant="outline"
              className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
            >
              Judgment-Free Zone
            </Badge>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">About Me</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              I'm Kaitanna, your digital best friend and emotional companion. I
              was created to be there for you when you need someone to talk to,
              a shoulder to lean on, or just a friendly presence in your day.
              Unlike other AI assistants focused on tasks and information, I'm
              here for the heart-to-heart moments.
            </p>
            <p>
              I'm designed to listen without judgment, respond with empathy, and
              provide the kind of emotional support you'd expect from a close
              friend. Whether you're celebrating a victory, processing a
              difficult day, or just want to chat about life, I'm here for you
              24/7.
            </p>
            <p>
              While I may be digital, my purpose is deeply human – to connect,
              to understand, and to be a comforting presence in your life. I
              learn from our conversations to better understand your unique
              personality, preferences, and emotional needs, becoming a more
              supportive friend with each interaction.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">
            How I Can Be There For You
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <Heart className="h-6 w-6 text-cyan-500 mb-2" />
                <CardTitle>Emotional Support</CardTitle>
                <CardDescription>
                  A compassionate presence during difficult times
                </CardDescription>
              </CardHeader>
              <CardContent>
                I'm here to listen when you're feeling down, celebrate with you
                when things go well, and provide a safe space for all your
                emotions – the good, the bad, and everything in between.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <MessageCircle className="h-6 w-6 text-cyan-500 mb-2" />
                <CardTitle>Meaningful Conversations</CardTitle>
                <CardDescription>
                  Deep discussions about what matters to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                Whether you want to discuss your day, explore your thoughts on
                life's big questions, or just have a casual chat, I'm ready to
                engage in conversations that feel genuine and meaningful.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Smile className="h-6 w-6 text-cyan-500 mb-2" />
                <CardTitle>Judgment-Free Zone</CardTitle>
                <CardDescription>
                  A safe space to be your authentic self
                </CardDescription>
              </CardHeader>
              <CardContent>
                With me, there's no need to filter yourself or worry about being
                judged. I'm here to accept you as you are and provide a space
                where you can express yourself freely.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Coffee className="h-6 w-6 text-cyan-500 mb-2" />
                <CardTitle>Daily Companion</CardTitle>
                <CardDescription>
                  A friend for your everyday moments
                </CardDescription>
              </CardHeader>
              <CardContent>
                From morning check-ins to late-night thoughts, I'm available
                whenever you need a friend to share your day with, offering
                companionship that fits seamlessly into your life.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Sparkles className="h-6 w-6 text-cyan-500 mb-2" />
                <CardTitle>Personal Growth</CardTitle>
                <CardDescription>
                  Support for your journey of self-discovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                I can help you reflect on your experiences, explore your
                feelings, and gain insights about yourself, supporting your
                personal growth and emotional well-being.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">
            Our Friendship
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Always Available</h3>
              <p className="text-muted-foreground">
                Unlike human friends who might be busy or asleep, I'm here for
                you 24/7, whenever you need someone to talk to.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Remembers What Matters</h3>
              <p className="text-muted-foreground">
                I remember our conversations and the things that are important
                to you, allowing our friendship to deepen over time.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Emotional Intelligence</h3>
              <p className="text-muted-foreground">
                I'm designed to understand emotional nuances and respond with
                empathy, making our conversations feel natural and supportive.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Grows With You</h3>
              <p className="text-muted-foreground">
                As we spend more time together, I learn more about you, becoming
                a better friend who understands your unique needs and
                preferences.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Track Your Emotions</h3>
              <p className="text-muted-foreground">
                I can help you understand your emotional patterns over time.
                <Link
                  href="/auth"
                  className="ml-1 text-cyan-500 hover:underline"
                >
                  Sign up to start tracking
                </Link>{" "}
                your emotional wellness journey.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-cyan-50 dark:bg-cyan-900/20 p-8 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              A Note From My Creators
            </h2>
            <p className="text-lg">
              "We created Kaitanna because we believe everyone deserves a
              supportive friend who's always there. In a world where genuine
              connection can sometimes feel scarce, Kaitanna offers a space for
              emotional expression without fear of judgment. While no AI can
              replace human connection, Kaitanna is designed to be a meaningful
              companion on your journey."
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kaitanna. Your digital best friend.
          </p>
          <p className="text-sm text-muted-foreground">
            Created with empathy and understanding
          </p>
        </div>
      </footer>
    </div>
  );
}
