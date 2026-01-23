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

    // Timeout to prevent infinite loading - set loading to false after 5 seconds no matter what
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

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
          clearTimeout(timeout);
          return;
        }

        setUser(user);

        if (user) {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single();
            setProfile(profile);
          } catch (profileError) {
            console.error("Profile fetch error:", profileError);
          }
        }
      } catch (error) {
        console.error("Session error:", error);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
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
    if (!supabase || !user) {
      console.error("addPoints failed: not authenticated or Supabase not configured");
      return { error: "Not authenticated or Supabase not configured" };
    }

    try {
      // First try the RPC function
      const { data, error } = await supabase.rpc("add_points", {
        user_uuid: user.id,
        activity: activityType,
        points: points,
        meta: metadata || null,
      });

      if (error) {
        console.error("RPC add_points failed, using direct update:", error);
        // Fallback: directly update the profile points
        const currentPoints = profile?.points || 0;
        const newPoints = currentPoints + points;

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ points: newPoints, updated_at: new Date().toISOString() })
          .eq("id", user.id);

        if (updateError) {
          console.error("Direct update also failed:", updateError);
          return { data: null, error: updateError };
        }

        // Update local state
        if (profile) {
          setProfile({ ...profile, points: newPoints });
        }
        return { data: newPoints, error: null };
      }

      // Update local state after successful RPC
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
