"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/lib/supabase/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  configured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ data: any; error: any }>;
  signInWithGoogle: () => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  addPoints: (activityType: string, points: number, metadata?: Record<string, unknown>) => Promise<{ data: any; error: any }>;
  updateStreak: () => Promise<{ data: any; error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  const refreshProfile = async () => {
    if (!user) return;
    const supabase = createClient();
    if (!supabase) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setConfigured(false);
      return;
    }

    setConfigured(true);
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getSession = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Auth getUser error:", userError);
          setLoading(false);
          return;
        }

        setUser(user);

        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Session error:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const supabase = createClient();
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const supabase = createClient();
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } };

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) return { error: { message: "Supabase not configured" } };

    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
    }
    return { error };
  };

  const addPoints = async (
    activityType: string,
    points: number,
    metadata?: Record<string, unknown>
  ) => {
    const supabase = createClient();
    if (!supabase || !user) {
      console.error("addPoints failed: not authenticated or Supabase not configured");
      return { data: null, error: "Not authenticated or Supabase not configured" };
    }

    try {
      console.log("Calling add_points RPC for user:", user.id, "points:", points);
      const { data, error } = await supabase.rpc("add_points", {
        user_uuid: user.id,
        activity: activityType,
        points: points,
        meta: metadata || null,
      });

      if (error) {
        console.error("add_points RPC failed:", error);
        return { data: null, error };
      }

      console.log("Points added successfully, new total:", data);
      // Update local state
      if (profile) {
        setProfile({ ...profile, points: data });
      }

      return { data, error: null };
    } catch (err) {
      console.error("addPoints exception:", err);
      return { data: null, error: err };
    }
  };

  const updateStreak = async () => {
    const supabase = createClient();
    if (!supabase || !user) return { data: null, error: "Not authenticated or Supabase not configured" };

    const { data, error } = await supabase.rpc("update_user_streak", {
      user_uuid: user.id,
    });

    if (!error && profile) {
      setProfile({ ...profile, streak: data });
    }

    return { data, error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        configured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        addPoints,
        updateStreak,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
