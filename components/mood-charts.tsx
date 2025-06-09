"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { MoodEntry } from "@/lib/mood-data";
import {
  format,
  subDays,
  subMonths,
  subYears,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

interface MoodChartsProps {
  moodEntries: MoodEntry[];
}

const MOOD_COLORS = {
  happy: "#10b981", // emerald
  neutral: "#6b7280", // gray
  sad: "#3b82f6", // blue
  angry: "#ef4444", // red
  anxious: "#8b5cf6", // violet
  other: "#f59e0b", // amber
};

const getMoodCategory = (mood: string): keyof typeof MOOD_COLORS => {
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

  if (happyMoods.includes(mood)) return "happy";
  if (neutralMoods.includes(mood)) return "neutral";
  if (sadMoods.includes(mood)) return "sad";
  if (angryMoods.includes(mood)) return "angry";
  if (anxiousMoods.includes(mood)) return "anxious";
  return "other";
};

// Custom tooltip for the pie chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border rounded-md shadow-sm">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export function MoodCharts({ moodEntries }: MoodChartsProps) {
  const [timeRange, setTimeRange] = useState<
    "week" | "month" | "6months" | "year"
  >("week");

  const getFilteredEntries = () => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "week":
        startDate = subDays(now, 7);
        break;
      case "month":
        startDate = subMonths(now, 1);
        break;
      case "6months":
        startDate = subMonths(now, 6);
        break;
      case "year":
        startDate = subYears(now, 1);
        break;
    }

    return moodEntries.filter((entry) => new Date(entry.date) >= startDate);
  };

  const getTimeSeriesData = () => {
    const filteredEntries = getFilteredEntries();
    const now = new Date();
    let days: Date[];

    switch (timeRange) {
      case "week":
        const weekStart = startOfWeek(subDays(now, 7));
        const weekEnd = endOfWeek(now);
        days = eachDayOfInterval({ start: weekStart, end: weekEnd });
        break;
      case "month":
        days = Array.from({ length: 30 }, (_, i) => subDays(now, 29 - i));
        break;
      case "6months":
        days = Array.from({ length: 180 }, (_, i) => subDays(now, 179 - i));
        break;
      case "year":
        days = Array.from({ length: 365 }, (_, i) => subDays(now, 364 - i));
        break;
    }

    return days.map((day) => {
      const dayEntries = filteredEntries.filter(
        (entry) =>
          format(new Date(entry.date), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd")
      );

      const moodCounts = dayEntries.reduce((acc, entry) => {
        const category = getMoodCategory(entry.mood);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate dominant mood for the day
      const dominantMood =
        Object.keys(moodCounts).length > 0
          ? Object.entries(moodCounts).reduce((a, b) =>
              moodCounts[a[0]] > moodCounts[b[0]] ? a : b
            )[0]
          : "neutral";

      return {
        date: format(day, timeRange === "week" ? "EEE" : "MMM dd"),
        fullDate: format(day, "yyyy-MM-dd"),
        ...moodCounts,
        dominant: dominantMood,
        total: dayEntries.length,
      };
    });
  };

  const getMoodDistribution = () => {
    const filteredEntries = getFilteredEntries();
    const distribution = filteredEntries.reduce((acc, entry) => {
      const category = getMoodCategory(entry.mood);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
      color: MOOD_COLORS[mood as keyof typeof MOOD_COLORS],
    }));
  };

  const timeSeriesData = getTimeSeriesData();
  const distributionData = getMoodDistribution();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTimeRange("week")}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            timeRange === "week"
              ? "bg-cyan-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Past Week
        </button>
        <button
          onClick={() => setTimeRange("month")}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            timeRange === "month"
              ? "bg-cyan-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Past Month
        </button>
        <button
          onClick={() => setTimeRange("6months")}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            timeRange === "6months"
              ? "bg-cyan-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          6 Months
        </button>
        <button
          onClick={() => setTimeRange("year")}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            timeRange === "year"
              ? "bg-cyan-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Past Year
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mood Trends</CardTitle>
            <CardDescription>Your emotional patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                happy: { label: "Happy", color: MOOD_COLORS.happy },
                sad: { label: "Sad", color: MOOD_COLORS.sad },
                angry: { label: "Angry", color: MOOD_COLORS.angry },
                anxious: { label: "Anxious", color: MOOD_COLORS.anxious },
                neutral: { label: "Neutral", color: MOOD_COLORS.neutral },
                other: { label: "Other", color: MOOD_COLORS.other },
              }}
              className="h-[280px] w-full"
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      name.toString().charAt(0).toUpperCase() +
                        name.toString().slice(1),
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="happy"
                    stackId="a"
                    fill={MOOD_COLORS.happy}
                    name="Happy"
                  />
                  <Bar
                    dataKey="neutral"
                    stackId="a"
                    fill={MOOD_COLORS.neutral}
                    name="Neutral"
                  />
                  <Bar
                    dataKey="sad"
                    stackId="a"
                    fill={MOOD_COLORS.sad}
                    name="Sad"
                  />
                  <Bar
                    dataKey="angry"
                    stackId="a"
                    fill={MOOD_COLORS.angry}
                    name="Angry"
                  />
                  <Bar
                    dataKey="anxious"
                    stackId="a"
                    fill={MOOD_COLORS.anxious}
                    name="Anxious"
                  />
                  <Bar
                    dataKey="other"
                    stackId="a"
                    fill={MOOD_COLORS.other}
                    name="Other"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <CardDescription>Breakdown of your emotions</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value) => (
                      <span className="text-xs">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
