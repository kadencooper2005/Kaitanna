"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const MOODS = [
  // Happy emotions
  {
    name: "Joyful",
    emoji: "😄",
    category: "happy",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    name: "Excited",
    emoji: "🤩",
    category: "happy",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    name: "Content",
    emoji: "😊",
    category: "happy",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    name: "Grateful",
    emoji: "🙏",
    category: "happy",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    name: "Peaceful",
    emoji: "😌",
    category: "happy",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    name: "Loved",
    emoji: "🥰",
    category: "happy",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    name: "Proud",
    emoji: "😤",
    category: "happy",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },

  // Neutral emotions
  {
    name: "Calm",
    emoji: "😐",
    category: "neutral",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  {
    name: "Okay",
    emoji: "🙂",
    category: "neutral",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  {
    name: "Tired",
    emoji: "😴",
    category: "neutral",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  {
    name: "Bored",
    emoji: "😑",
    category: "neutral",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  {
    name: "Confused",
    emoji: "😕",
    category: "neutral",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },

  // Sad emotions
  {
    name: "Sad",
    emoji: "😢",
    category: "sad",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    name: "Lonely",
    emoji: "😔",
    category: "sad",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    name: "Disappointed",
    emoji: "😞",
    category: "sad",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    name: "Melancholy",
    emoji: "😪",
    category: "sad",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    name: "Heartbroken",
    emoji: "💔",
    category: "sad",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },

  // Angry emotions
  {
    name: "Angry",
    emoji: "😠",
    category: "angry",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  {
    name: "Frustrated",
    emoji: "😤",
    category: "angry",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  {
    name: "Irritated",
    emoji: "😒",
    category: "angry",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  {
    name: "Annoyed",
    emoji: "🙄",
    category: "angry",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },

  // Anxious emotions
  {
    name: "Anxious",
    emoji: "😰",
    category: "anxious",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  {
    name: "Worried",
    emoji: "😟",
    category: "anxious",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  {
    name: "Stressed",
    emoji: "😫",
    category: "anxious",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  {
    name: "Overwhelmed",
    emoji: "🤯",
    category: "anxious",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },

  // Other emotions
  {
    name: "Hopeful",
    emoji: "🌟",
    category: "other",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    name: "Curious",
    emoji: "🤔",
    category: "other",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    name: "Surprised",
    emoji: "😲",
    category: "other",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: string, note?: string) => void;
}

export function MoodSelector({ onMoodSelect }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);
    setShowNote(true);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      onMoodSelect(selectedMood, note.trim() || undefined);
      setSelectedMood(null);
      setNote("");
      setShowNote(false);
    }
  };

  const handleCancel = () => {
    setSelectedMood(null);
    setNote("");
    setShowNote(false);
  };

  if (showNote && selectedMood) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-2">
              Let&apos;s track your mood
            </h2>
            <p className="text-muted-foreground mb-4">
              Don&apos;t worry about being perfect
            </p>
            <p className="text-sm text-muted-foreground">
              You&apos;re doing great!
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mood-note">Optional note</Label>
              <Textarea
                id="mood-note"
                placeholder="What's on your mind? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                Save Mood
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Select the emotion that best describes how you're feeling right now
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {MOODS.map((mood) => (
          <button
            key={mood.name}
            onClick={() => handleMoodClick(mood.name)}
            className={`
              p-3 rounded-lg border-2 border-transparent hover:border-cyan-500 
              transition-all duration-200 hover:scale-105 focus:outline-none 
              focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
              ${mood.color}
            `}
          >
            <div className="text-2xl mb-1">{mood.emoji}</div>
            <div className="text-xs font-medium">{mood.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
