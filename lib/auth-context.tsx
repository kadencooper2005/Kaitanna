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
  signInWithGoogle: () => Promise<void>; // ✅ Added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter(); // ✅ Added

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session?.user) {
        const u = data.session.user;
        setUser({
          id: u.id,
          username: u.user_metadata?.username || u.email || "",
          email: u.email || "",
          createdAt: u.created_at || "",
        });
      }
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          const u = session.user;
          setUser({
            id: u.id,
            username: u.user_metadata?.username || u.email || "",
            email: u.email || "",
            createdAt: u.created_at || "",
          });

          router.push("/dashboard"); // ✅ Redirect after login
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const login = async (email: string, password: string): Promise<boolean> => {
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

    return true;
  };

  const signup = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
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

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
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
