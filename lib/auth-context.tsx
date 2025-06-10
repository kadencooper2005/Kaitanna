"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const u = data.session.user;
          setUser({
            id: u.id,
            username: u.user_metadata?.username || u.email || "",
            email: u.email || "",
            createdAt: u.created_at || "",
          });
          // No redirect here on init
        }
      }
    };

    init();

    if (supabase) {
      const authListener = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            const u = session.user;
            setUser({
              id: u.id,
              username: u.user_metadata?.username || u.email || "",
              email: u.email || "",
              createdAt: u.created_at || "",
            });
            // Redirect after login or OAuth redirect
            router.push("/dashboard");
          } else {
            setUser(null);
          }
        }
      );

      return () => {
        if (authListener?.data?.subscription) {
          authListener.data.subscription.unsubscribe();
        }
      };
    }
  }, [router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) return false;

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) return false;

    const u = data.user;
    setUser({
      id: u.id,
      username: u.user_metadata?.username || u.email || "",
      email: u.email || "",
      createdAt: u.created_at || "",
    });

    // Redirect after successful login
    router.push("/dashboard");

    return true;
  };

  const signup = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    if (!supabase) return false;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error || !data.user) return false;

    const u = data.user;
    setUser({
      id: u.id,
      username,
      email,
      createdAt: u.created_at || "",
    });

    // Optionally redirect after signup
    router.push("/dashboard");

    return true;
  };

  const logout = async () => {
    if (!supabase) return;

    await supabase.auth.signOut();
    setUser(null);
    router.push("/"); // Redirect to homepage or login page after logout
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      console.error("Supabase instance is not available");
      return;
    }

    try {
      // This will redirect to Google and back, no immediate session or redirect here
      await supabase.auth.signInWithOAuth({
        provider: "google",
      });
    } catch (err) {
      console.error("Unexpected error during Google sign in:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, signInWithGoogle }}
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
