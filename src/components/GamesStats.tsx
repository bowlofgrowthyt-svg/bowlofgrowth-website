"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function GamesStats() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex justify-center gap-8">
            <div className="h-12 w-24 bg-gray-200 rounded" />
            <div className="h-12 w-24 bg-gray-200 rounded" />
            <div className="h-12 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (user) {
    return (
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">{profile?.points ?? 0}</p>
              <p className="text-sm text-gray-500">Total Points</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{profile?.streak ?? 0}</p>
              <p className="text-sm text-gray-500">Day Streak</p>
            </div>
            <div>
              <Link href="/leaderboard" className="inline-block">
                <p className="text-2xl font-bold text-purple-600">🏆</p>
                <p className="text-sm text-gray-500 hover:text-purple-600">Leaderboard</p>
              </Link>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Welcome back, <span className="font-medium text-purple-600">{profile?.full_name || user.email?.split("@")[0]}</span>!
            Keep playing to earn more points.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-600">🎮</p>
            <p className="text-sm text-gray-500">Play Games</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">🏆</p>
            <p className="text-sm text-gray-500">Earn Points</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">📈</p>
            <p className="text-sm text-gray-500">Track Progress</p>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          <Link href="/auth" className="text-purple-600 hover:underline font-medium">
            Sign in
          </Link>{" "}
          to track your progress and earn points!
        </p>
      </div>
    </section>
  );
}
