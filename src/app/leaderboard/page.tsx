"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type TimeFrame = "daily" | "weekly" | "monthly" | "allTime";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  isCurrentUser: boolean;
}

export default function LeaderboardPage() {
  const { user, profile } = useAuth();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("allTime");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFrame]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?timeframe=${timeFrame}`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setUserRank(data.userRank || null);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const timeFrameLabels: Record<TimeFrame, string> = {
    daily: "Today",
    weekly: "This Week",
    monthly: "This Month",
    allTime: "All Time",
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
    if (rank === 3) return "bg-gradient-to-r from-amber-600 to-amber-700 text-white";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h1>
          <p className="text-gray-600">See who&apos;s leading the growth journey!</p>
        </div>

        {/* User Stats */}
        {user && (
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-200">Your Points</p>
                <p className="text-3xl font-bold">{profile?.points ?? 0}</p>
              </div>
              {userRank && (
                <div className="text-right">
                  <p className="text-sm text-purple-200">Your Rank</p>
                  <p className="text-3xl font-bold">#{userRank}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Time Frame Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
          {(["daily", "weekly", "monthly", "allTime"] as TimeFrame[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                timeFrame === tf
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {timeFrameLabels[tf]}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-500 mt-4">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="font-semibold text-gray-900 mb-2">No scores yet!</h3>
              <p className="text-gray-600 mb-4">Be the first to play games and earn points.</p>
              <Link
                href="/games"
                className="inline-block px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
              >
                Play Games
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 ${
                    entry.isCurrentUser ? "bg-purple-50" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyle(
                      entry.rank
                    )}`}
                  >
                    {getRankEmoji(entry.rank)}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${entry.isCurrentUser ? "text-purple-600" : "text-gray-900"}`}>
                      {entry.name}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{entry.points.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/games"
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
          >
            Play Games to Earn Points
          </Link>
        </div>
      </div>
    </div>
  );
}
