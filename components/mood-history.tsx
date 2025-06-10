"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MoodEntry } from "@/lib/mood-data";
import { format } from "date-fns";

interface MoodHistoryProps {
  moodEntries: MoodEntry[];
}

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

const getMoodColor = (mood: string): string => {
  const happyMoods = [
    "Joyful",
    "Excited",
    "Content",
    "Grateful",
    "Peaceful",
    "Loved",
    "Proud",
  ];
  const neutralMoods = ["Calm", "Okay", "Tired", "Bored", "Confused"];
  const sadMoods = [
    "Sad",
    "Lonely",
    "Disappointed",
    "Melancholy",
    "Heartbroken",
  ];
  const angryMoods = ["Angry", "Frustrated", "Irritated", "Annoyed"];
  const anxiousMoods = ["Anxious", "Worried", "Stressed", "Overwhelmed"];

  if (happyMoods.includes(mood))
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  if (neutralMoods.includes(mood))
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  if (sadMoods.includes(mood))
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  if (angryMoods.includes(mood))
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  if (anxiousMoods.includes(mood))
    return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
  return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
};

export function MoodHistory({ moodEntries }: MoodHistoryProps) {
  const sortedEntries = [...moodEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedEntries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No mood entries yet. Start tracking your emotions to see your
            history here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry) => (
        <Card key={entry.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={getMoodColor(entry.mood)}
                    >
                      {entry.mood}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), "MMM dd, yyyy")}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      &quot;{entry.note}&quot;
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(new Date(entry.date), "h:mm a")}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
