"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type GameState = "waiting" | "ready" | "go" | "result" | "too-early";

export default function ReactionTimeGame() {
  const { user, loading, addPoints } = useAuth();
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);

  // Track if user is logged in (wait for auth to load)
  const isLoggedIn = !loading && !!user;

  const startGame = useCallback(() => {
    setGameState("ready");
    const delay = Math.random() * 4000 + 1000; // 1-5 seconds

    const timeoutId = setTimeout(() => {
      setGameState("go");
      setStartTime(Date.now());
    }, delay);

    // Store timeout ID to clear if clicked too early
    (window as any).reactionTimeout = timeoutId;
  }, []);

  const handleClick = useCallback(() => {
    if (gameState === "waiting" || gameState === "result" || gameState === "too-early") {
      startGame();
    } else if (gameState === "ready") {
      // Clicked too early
      clearTimeout((window as any).reactionTimeout);
      setGameState("too-early");
    } else if (gameState === "go") {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setAttempts((prev) => [...prev, time]);
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
      setGameState("result");

      // Award points based on reaction time (faster = more points)
      if (isLoggedIn) {
        const points = time < 200 ? 50 : time < 250 ? 30 : time < 300 ? 20 : time < 350 ? 15 : 10;
        addPoints("reaction_time", points, { reactionTime: time });
        setPointsEarned((prev) => prev + points);
      }
    }
  }, [gameState, startTime, bestTime, startGame, isLoggedIn, addPoints]);

  const getAverageTime = () => {
    if (attempts.length === 0) return 0;
    return Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length);
  };

  const getReactionRating = (time: number) => {
    if (time < 200) return { text: "Incredible!", color: "#10B981", emoji: "🏆" };
    if (time < 250) return { text: "Excellent!", color: "#22C55E", emoji: "⚡" };
    if (time < 300) return { text: "Great!", color: "#84CC16", emoji: "🎯" };
    if (time < 350) return { text: "Good", color: "#FBBF24", emoji: "👍" };
    if (time < 400) return { text: "Average", color: "#F59E0B", emoji: "😊" };
    return { text: "Keep practicing!", color: "#EF4444", emoji: "💪" };
  };

  const resetGame = () => {
    setAttempts([]);
    setBestTime(null);
    setGameState("waiting");
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Games
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[var(--muted)]">
              Attempts: <strong className="text-[var(--foreground)]">{attempts.length}</strong>
            </span>
            {bestTime && (
              <span className="text-[var(--muted)]">
                Best: <strong className="text-green-600">{bestTime}ms</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            ⚡ Reaction Time
          </h1>
          <p className="text-[var(--muted)]">
            Test your reflexes! Click as soon as the screen turns green.
          </p>
        </div>

        {/* Game Box */}
        <div
          onClick={handleClick}
          className="relative w-full h-[400px] rounded-2xl cursor-pointer flex items-center justify-center transition-all duration-200 select-none"
          style={{
            backgroundColor:
              gameState === "waiting" || gameState === "result"
                ? "#3B82F6"
                : gameState === "ready"
                ? "#EF4444"
                : gameState === "go"
                ? "#10B981"
                : "#F59E0B",
          }}
        >
          {gameState === "waiting" && (
            <div className="text-white text-center">
              <div className="text-6xl mb-4">🖱️</div>
              <p className="text-2xl font-semibold mb-2">Click to Start</p>
              <p className="text-white/70">Wait for green, then click!</p>
            </div>
          )}

          {gameState === "ready" && (
            <div className="text-white text-center">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-2xl font-semibold mb-2">Wait for Green...</p>
              <p className="text-white/70">Don't click yet!</p>
            </div>
          )}

          {gameState === "go" && (
            <div className="text-white text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-4xl font-bold mb-2">CLICK NOW!</p>
            </div>
          )}

          {gameState === "too-early" && (
            <div className="text-white text-center">
              <div className="text-6xl mb-4">😅</div>
              <p className="text-2xl font-semibold mb-2">Too Early!</p>
              <p className="text-white/70">Click to try again</p>
            </div>
          )}

          {gameState === "result" && (
            <div className="text-white text-center">
              <div className="text-6xl mb-4">{getReactionRating(reactionTime).emoji}</div>
              <p className="text-5xl font-bold mb-2">{reactionTime}ms</p>
              <p
                className="text-xl font-semibold mb-2"
                style={{ color: getReactionRating(reactionTime).color }}
              >
                {getReactionRating(reactionTime).text}
              </p>
              {isLoggedIn && (
                <p className="text-green-300 text-sm mb-2">
                  +{reactionTime < 200 ? 50 : reactionTime < 250 ? 30 : reactionTime < 300 ? 20 : reactionTime < 350 ? 15 : 10} points!
                </p>
              )}
              {!isLoggedIn && !loading && (
                <p className="text-yellow-300 text-sm mb-2">
                  <Link href="/auth" className="underline">Sign in</Link> to save points!
                </p>
              )}
              <p className="text-white/70">Click to try again</p>
            </div>
          )}
        </div>

        {/* Stats */}
        {attempts.length > 0 && (
          <div className="mt-8 grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
              <p className="text-2xl font-bold text-purple-600">{attempts.length}</p>
              <p className="text-sm text-gray-500">Attempts</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
              <p className="text-2xl font-bold text-green-600">{bestTime}ms</p>
              <p className="text-sm text-gray-500">Best Time</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{getAverageTime()}ms</p>
              <p className="text-sm text-gray-500">Average</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
              <p className="text-2xl font-bold text-amber-500">{pointsEarned}</p>
              <p className="text-sm text-gray-500">Points Earned</p>
            </div>
          </div>
        )}

        {/* Recent Attempts */}
        {attempts.length > 1 && (
          <div className="mt-6 bg-white rounded-xl p-4 border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[var(--foreground)]">Recent Attempts</h3>
              <button
                onClick={resetGame}
                className="text-sm text-red-500 hover:underline"
              >
                Reset All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {attempts.slice(-10).map((time, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: getReactionRating(time).color + "20",
                    color: getReactionRating(time).color,
                  }}
                >
                  {time}ms
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-[var(--secondary)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-3">💡 Tips</h3>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>• Average human reaction time is around 250ms</li>
            <li>• Professional gamers often achieve under 200ms</li>
            <li>• Stay relaxed and focused for best results</li>
            <li>• Try to anticipate without clicking too early</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
