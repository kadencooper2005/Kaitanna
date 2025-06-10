"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    username: string,
    password: string,
    isGoogle?: boolean
  ) => Promise<boolean>;
  signup: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userId: string, updates: ProfileUpdate) => Promise<boolean>;
  deleteAccount: (userId: string) => Promise<boolean>;
}

interface ProfileUpdate {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface StoredUser {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

interface MoodEntry {
  userId: string;
  // Add other mood entry fields as needed
}

interface JournalEntry {
  user_id: string;
  // Add other journal entry fields as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("kaitanna-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (
    username: string,
    password: string,
    isGoogle = false
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (isGoogle) {
      // Simulate Google OAuth
      const googleUser: User = {
        id: "google_" + Date.now(),
        username: "Google User",
        email: "user@gmail.com",
        createdAt: new Date().toISOString(),
      };
      setUser(googleUser);
      localStorage.setItem("kaitanna-user", JSON.stringify(googleUser));
      return true;
    }

    // Check stored users
    const users = JSON.parse(localStorage.getItem("kaitanna-users") || "[]");
    const foundUser = users.find(
      (u: StoredUser) => u.username === username && u.password === password
    );

    if (foundUser) {
      const userSession: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        createdAt: foundUser.createdAt,
      };
      setUser(userSession);
      localStorage.setItem("kaitanna-user", JSON.stringify(userSession));
      return true;
    }

    return false;
  };

  const signup = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("kaitanna-users") || "[]");
    const existingUser = users.find(
      (u: StoredUser) => u.username === username || u.email === email
    );

    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("kaitanna-users", JSON.stringify(users));

    // Log in the new user
    const userSession: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
    setUser(userSession);
    localStorage.setItem("kaitanna-user", JSON.stringify(userSession));

    return true;
  };

  const updateProfile = async (
    userId: string,
    updates: ProfileUpdate
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem("kaitanna-users") || "[]");
    const userIndex = users.findIndex((u: StoredUser) => u.id === userId);

    if (userIndex === -1) {
      return false;
    }

    const currentUser = users[userIndex];

    // If updating password, verify current password
    if (updates.currentPassword && updates.newPassword) {
      if (currentUser.password !== updates.currentPassword) {
        return false;
      }
      currentUser.password = updates.newPassword;
    }

    // If updating username or email, check for conflicts
    if (updates.username || updates.email) {
      const conflictUser = users.find(
        (u: StoredUser) =>
          u.id !== userId &&
          ((updates.username && u.username === updates.username) ||
            (updates.email && u.email === updates.email))
      );

      if (conflictUser) {
        return false;
      }

      if (updates.username) currentUser.username = updates.username;
      if (updates.email) currentUser.email = updates.email;
    }

    // Update the user in storage
    users[userIndex] = currentUser;
    localStorage.setItem("kaitanna-users", JSON.stringify(users));

    // Update current session if it's the same user
    if (user && user.id === userId) {
      const updatedUser: User = {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        createdAt: currentUser.createdAt,
      };
      setUser(updatedUser);
      localStorage.setItem("kaitanna-user", JSON.stringify(updatedUser));
    }

    return true;
  };

  const deleteAccount = async (userId: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Remove user from users list
      const users = JSON.parse(localStorage.getItem("kaitanna-users") || "[]");
      const filteredUsers = users.filter((u: StoredUser) => u.id !== userId);
      localStorage.setItem("kaitanna-users", JSON.stringify(filteredUsers));

      // Remove user's mood data
      const moodEntries = JSON.parse(
        localStorage.getItem("kaitanna-mood-entries") || "[]"
      );
      const filteredMoodEntries = moodEntries.filter(
        (entry: MoodEntry) => entry.userId !== userId
      );
      localStorage.setItem(
        "kaitanna-mood-entries",
        JSON.stringify(filteredMoodEntries)
      );

      // Remove user's journal data
      const journalEntries = JSON.parse(
        localStorage.getItem("kaitanna-journal-entries") || "[]"
      );
      const filteredJournalEntries = journalEntries.filter(
        (entry: JournalEntry) => entry.user_id !== userId
      );
      localStorage.setItem(
        "kaitanna-journal-entries",
        JSON.stringify(filteredJournalEntries)
      );

      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kaitanna-user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateProfile, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
