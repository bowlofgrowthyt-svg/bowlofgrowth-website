"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface Target {
  id: number;
  x: number;
  y: number;
  isDistraction: boolean;
  color: string;
}

export default function FocusTrainerGame() {
  const { user, loading, addPoints } = useAuth();
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [pointsEarned, setPointsEarned] = useState(0);
  const [targetsHit, setTargetsHit] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const targetIdRef = useRef(0);

  const targetColor = "#7C3AED"; // Purple - target to click
  const distractionColors = ["#EF4444", "#3B82F6", "#22C55E", "#F97316"]; // Distractions

  const spawnTarget = useCallback(() => {
    if (!gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const size = 50;
    const x = Math.random() * (rect.width - size);
    const y = Math.random() * (rect.height - size);

    // More distractions at higher levels
    const distractionChance = Math.min(0.3 + level * 0.05, 0.6);
    const isDistraction = Math.random() < distractionChance;

    const newTarget: Target = {
      id: targetIdRef.current++,
      x,
      y,
      isDistraction,
      color: isDistraction
        ? distractionColors[Math.floor(Math.random() * distractionColors.length)]
        : targetColor,
    };

    setTargets((prev) => [...prev, newTarget]);

    // Remove target after a delay (shorter at higher levels)
    const lifetime = Math.max(2000 - level * 100, 800);
    setTimeout(() => {
      setTargets((prev) => {
        const target = prev.find((t) => t.id === newTarget.id);
        if (target && !target.isDistraction) {
          // Missed a real target
          setLives((l) => Math.max(0, l - 1));
        }
        return prev.filter((t) => t.id !== newTarget.id);
      });
    }, lifetime);
  }, [level]);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setTimeLeft(45);
    setTargets([]);
    setTargetsHit(0);
    setPointsEarned(0);
    setPointsAwarded(false);
    targetIdRef.current = 0;
    setGameState("playing");
  }, []);

  // Spawn targets periodically
  useEffect(() => {
    if (gameState !== "playing" || lives <= 0) return;

    const interval = Math.max(1500 - level * 100, 600);
    const timer = setInterval(spawnTarget, interval);

    return () => clearInterval(timer);
  }, [gameState, level, lives, spawnTarget]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing" || lives <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, lives]);

  // Check game over
  useEffect(() => {
    if (lives <= 0 && gameState === "playing") {
      setGameState("finished");
    }
  }, [lives, gameState]);

  // Level up every 50 points
  useEffect(() => {
    const newLevel = Math.floor(score / 50) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  }, [score, level]);

  // Award points when game finishes and user is logged in
  useEffect(() => {
    if (gameState === "finished" && user && !pointsAwarded && score > 0) {
      const points = Math.floor(score / 5) + (level > 3 ? 10 : 0);
      if (points > 0) {
        setPointsAwarded(true);
        addPoints("focus-trainer", points, { score, level, targetsHit }).then((result) => {
          if (!result.error) {
            setPointsEarned(points);
          } else {
            console.error("Failed to add points:", result.error);
            setPointsAwarded(false);
          }
        });
      }
    }
  }, [gameState, user, pointsAwarded, score, level, targetsHit, addPoints]);

  const handleTargetClick = (target: Target) => {
    if (gameState !== "playing") return;

    if (target.isDistraction) {
      // Clicked a distraction - lose a life
      setLives((l) => Math.max(0, l - 1));
      setTargets((prev) => prev.filter((t) => t.id !== target.id));
    } else {
      // Clicked correct target - gain points
      const points = 10 + level * 2;
      setScore((s) => s + points);
      setTargetsHit((h) => h + 1);
      setTargets((prev) => prev.filter((t) => t.id !== target.id));
    }
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
          {gameState === "playing" && (
            <div className="flex items-center gap-4 text-sm">
              <span className={`font-bold ${timeLeft <= 10 ? "text-red-500" : "text-[var(--foreground)]"}`}>
                {timeLeft}s
              </span>
              <span className="text-[var(--muted)]">
                Level: <strong className="text-[var(--foreground)]">{level}</strong>
              </span>
              <span className="text-[var(--muted)]">
                Score: <strong className="text-green-600">{score}</strong>
              </span>
              <span className="text-red-500">
                {"❤️".repeat(lives)}{"🖤".repeat(3 - lives)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Focus Trainer
          </h1>
          <p className="text-[var(--muted)]">
            Click the purple targets, ignore the distractions!
          </p>
        </div>

        {/* Ready State */}
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Train Your Focus
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: targetColor }} />
                <span className="text-sm text-[var(--muted)]">Click these!</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500" />
                <span className="text-sm text-[var(--muted)]">Ignore these</span>
              </div>
            </div>
            <p className="text-[var(--muted)] mb-6">
              You have 45 seconds and 3 lives. Don&apos;t click distractions or miss targets!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Playing State */}
        {gameState === "playing" && (
          <div
            ref={gameAreaRef}
            className="bg-white rounded-2xl border border-[var(--border)] relative overflow-hidden"
            style={{ height: "400px" }}
          >
            {/* Timer Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className={`h-full transition-all duration-1000 ${timeLeft <= 10 ? "bg-red-500" : "bg-[var(--primary)]"}`}
                style={{ width: `${(timeLeft / 45) * 100}%` }}
              />
            </div>

            {targets.map((target) => (
              <button
                key={target.id}
                onClick={() => handleTargetClick(target)}
                className="absolute w-12 h-12 rounded-full transition-transform hover:scale-110 animate-pulse"
                style={{
                  left: target.x,
                  top: target.y,
                  backgroundColor: target.color,
                }}
              />
            ))}

            {targets.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[var(--muted)]">Waiting for targets...</p>
              </div>
            )}
          </div>
        )}

        {/* Finished State */}
        {gameState === "finished" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">
              {score >= 200 ? "🏆" : score >= 100 ? "⭐" : "👍"}
            </div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              {lives > 0 ? "Time&apos;s Up!" : "Game Over!"}
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-6 max-w-sm mx-auto">
              <div className="bg-[var(--secondary)] rounded-xl p-4">
                <p className="text-3xl font-bold text-[var(--primary)]">{score}</p>
                <p className="text-sm text-[var(--muted)]">Score</p>
              </div>
              <div className="bg-[var(--secondary)] rounded-xl p-4">
                <p className="text-3xl font-bold text-green-600">{targetsHit}</p>
                <p className="text-sm text-[var(--muted)]">Targets</p>
              </div>
              <div className="bg-[var(--secondary)] rounded-xl p-4">
                <p className="text-3xl font-bold text-orange-500">{level}</p>
                <p className="text-sm text-[var(--muted)]">Level</p>
              </div>
            </div>

            {pointsEarned > 0 && (
              <p className="text-sm text-green-600 font-medium mb-4">
                +{pointsEarned} points earned!
              </p>
            )}
            {!user && !loading && (
              <p className="text-sm text-amber-600 mb-4">
                <Link href="/auth" className="underline">Sign in</Link> to save points!
              </p>
            )}
            {loading && (
              <p className="text-sm text-[var(--muted)] mb-4">
                Checking login status...
              </p>
            )}

            <button
              onClick={startGame}
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-[var(--secondary)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-3">Focus Tips</h3>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>• Focus on the color, not the movement</li>
            <li>• Stay calm - panicking leads to mistakes</li>
            <li>• The game gets faster at higher levels</li>
            <li>• Practice selective attention daily</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
