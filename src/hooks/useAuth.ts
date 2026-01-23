"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/lib/supabase/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profile);
      }

      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(profile);
      } else {
        setProfile(null);
      }
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

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string
  ) => {
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
    if (!supabase || !user) return { error: "Not authenticated or Supabase not configured" };

    const { data, error } = await supabase.rpc("add_points", {
      user_uuid: user.id,
      activity: activityType,
      points: points,
      meta: metadata || null,
    });

    if (!error && profile) {
      setProfile({ ...profile, points: data });
    }

    return { data, error };
  };

  const updateStreak = async () => {
    const supabase = createClient();
    if (!supabase || !user) return { error: "Not authenticated or Supabase not configured" };

    const { data, error } = await supabase.rpc("update_user_streak", {
      user_uuid: user.id,
    });

    if (!error && profile) {
      setProfile({ ...profile, streak: data });
    }

    return { data, error };
  };

  return {
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
  };
}
