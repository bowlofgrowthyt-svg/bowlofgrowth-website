import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "allTime";

    // If Supabase not configured, return mock data
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        leaderboard: [
          { rank: 1, name: "Player1", points: 1500, isCurrentUser: false },
          { rank: 2, name: "Player2", points: 1200, isCurrentUser: false },
          { rank: 3, name: "Player3", points: 900, isCurrentUser: false },
        ],
        userRank: null,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // For now, just get all-time points from profiles
    // In a production app, you'd have a separate points_history table for daily/weekly/monthly
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, full_name, points")
      .order("points", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Leaderboard error:", error);
      return NextResponse.json({ leaderboard: [], userRank: null });
    }

    const leaderboard = (profiles || []).map((profile, index) => ({
      rank: index + 1,
      name: profile.full_name || `User ${index + 1}`,
      points: profile.points || 0,
      isCurrentUser: false, // We'd need to pass user ID to determine this
    }));

    return NextResponse.json({
      leaderboard,
      userRank: null,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ leaderboard: [], userRank: null });
  }
}
