"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function VisualMemoryGame() {
  const { user, loading, addPoints } = useAuth();
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [gridSize, setGridSize] = useState(3);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"ready" | "showing" | "input" | "correct" | "wrong" | "finished">("ready");
  const [pointsEarned, setPointsEarned] = useState(0);

  const generatePattern = useCallback((size: number, count: number) => {
    const totalCells = size * size;
    const cells: number[] = [];
    while (cells.length < count) {
      const cell = Math.floor(Math.random() * totalCells);
      if (!cells.includes(cell)) {
        cells.push(cell);
      }
    }
    return cells;
  }, []);

  const startLevel = useCallback((lvl: number) => {
    const size = Math.min(3 + Math.floor((lvl - 1) / 3), 6);
    const patternCount = Math.min(3 + lvl, size * size - 1);

    setGridSize(size);
    const newPattern = generatePattern(size, patternCount);
    setPattern(newPattern);
    setUserPattern([]);
    setLevel(lvl);
    setGameState("showing");
  }, [generatePattern]);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setPointsEarned(0);
    startLevel(1);
  }, [startLevel]);

  // Show pattern then switch to input
  useEffect(() => {
    if (gameState !== "showing") return;

    const showTime = Math.max(2000 - level * 100, 800);
    const timer = setTimeout(() => {
      setGameState("input");
    }, showTime);

    return () => clearTimeout(timer);
  }, [gameState, level]);

  const handleCellClick = (index: number) => {
    if (gameState !== "input") return;
    if (userPattern.includes(index)) return;

    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);

    if (pattern.includes(index)) {
      // Correct cell
      if (newUserPattern.filter((i) => pattern.includes(i)).length === pattern.length) {
        // Completed the pattern!
        const points = level * 15;
        setScore((s) => s + points);
        setGameState("correct");
        setTimeout(() => startLevel(level + 1), 1000);
      }
    } else {
      // Wrong cell
      setLives((l) => l - 1);
      setGameState("wrong");
      setTimeout(() => {
        if (lives <= 1) {
          setGameState("finished");
        } else {
          startLevel(level);
        }
      }, 1000);
    }
  };

  // Award points when game finishes
  useEffect(() => {
    if (gameState === "finished" && user && !pointsAwarded && score > 0) {
      const points = Math.floor(score / 5) + (level > 5 ? 15 : 0);
      if (points > 0) {
        setPointsAwarded(true);
        addPoints("visual-memory", points, { score, level: level - 1 }).then((result) => {
          if (!result.error) {
            setPointsEarned(points);
          } else {
            setPointsAwarded(false);
          }
        });
      }
    }
  }, [gameState, user, pointsAwarded, score, level, addPoints]);

  const getCellClass = (index: number) => {
    if (gameState === "showing") {
      return pattern.includes(index)
        ? "bg-[var(--primary)]"
        : "bg-gray-200";
    }
    if (gameState === "correct" || gameState === "wrong") {
      if (pattern.includes(index)) {
        return userPattern.includes(index)
          ? "bg-green-500"
          : "bg-[var(--primary)]";
      }
      if (userPattern.includes(index)) {
        return "bg-red-500";
      }
      return "bg-gray-200";
    }
    // Input state
    if (userPattern.includes(index)) {
      return pattern.includes(index)
        ? "bg-green-500"
        : "bg-red-500";
    }
    return "bg-gray-200 hover:bg-gray-300 cursor-pointer";
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
          {gameState !== "ready" && gameState !== "finished" && (
            <div className="flex items-center gap-4 text-sm">
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
            Visual Memory
          </h1>
          <p className="text-[var(--muted)]">
            Remember the pattern and click all the highlighted squares!
          </p>
        </div>

        {/* Ready State */}
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">👁️</div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Visual Memory Test
            </h2>
            <p className="text-[var(--muted)] mb-6">
              A pattern will flash briefly. Click all the squares that were highlighted.
              The pattern gets bigger and more complex each level!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Game Grid */}
        {(gameState === "showing" || gameState === "input" || gameState === "correct" || gameState === "wrong") && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)]">
            <div className="text-center mb-6">
              {gameState === "showing" && (
                <p className="text-lg text-[var(--muted)]">Remember this pattern...</p>
              )}
              {gameState === "input" && (
                <p className="text-lg text-[var(--muted)]">
                  Click all {pattern.length} squares! ({userPattern.filter((i) => pattern.includes(i)).length}/{pattern.length})
                </p>
              )}
              {gameState === "correct" && (
                <p className="text-lg text-green-600 font-semibold">Perfect! +{level * 15} points</p>
              )}
              {gameState === "wrong" && (
                <p className="text-lg text-red-600 font-semibold">Wrong! Try again</p>
              )}
            </div>

            <div
              className="grid gap-2 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                maxWidth: `${gridSize * 60}px`,
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleCellClick(index)}
                  className={`aspect-square rounded-lg transition-colors ${getCellClass(index)}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Finished State */}
        {gameState === "finished" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">
              {level >= 8 ? "🏆" : level >= 5 ? "⭐" : "👍"}
            </div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Game Over!
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs mx-auto">
              <div className="bg-[var(--secondary)] rounded-xl p-4">
                <p className="text-3xl font-bold text-[var(--primary)]">{score}</p>
                <p className="text-sm text-[var(--muted)]">Score</p>
              </div>
              <div className="bg-[var(--secondary)] rounded-xl p-4">
                <p className="text-3xl font-bold text-green-600">{level - 1}</p>
                <p className="text-sm text-[var(--muted)]">Max Level</p>
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
          <h3 className="font-semibold text-[var(--foreground)] mb-3">Memory Tips</h3>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>• Look for patterns or shapes in the highlighted squares</li>
            <li>• Try to visualize the pattern as a whole image</li>
            <li>• Focus on corners and edges first</li>
            <li>• Practice improves visual working memory</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
