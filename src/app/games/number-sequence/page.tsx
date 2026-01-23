"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function NumberSequenceGame() {
  const { user, loading, addPoints } = useAuth();
  const isLoggedIn = !loading && !!user;
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [bestLevel, setBestLevel] = useState(0);
  const [gameState, setGameState] = useState<"ready" | "showing" | "input" | "correct" | "wrong" | "finished">("ready");
  const [showingIndex, setShowingIndex] = useState(-1);
  const [pointsEarned, setPointsEarned] = useState(0);

  const generateSequence = useCallback((length: number) => {
    const seq: number[] = [];
    for (let i = 0; i < length; i++) {
      seq.push(Math.floor(Math.random() * 9) + 1);
    }
    return seq;
  }, []);

  const startGame = useCallback(() => {
    setLevel(1);
    setScore(0);
    setBestLevel(0);
    setPointsEarned(0);
    const newSequence = generateSequence(3);
    setSequence(newSequence);
    setUserSequence([]);
    setGameState("showing");
    setShowingIndex(0);
  }, [generateSequence]);

  const nextLevel = useCallback(() => {
    const newLevel = level + 1;
    setLevel(newLevel);
    const sequenceLength = 2 + newLevel;
    const newSequence = generateSequence(sequenceLength);
    setSequence(newSequence);
    setUserSequence([]);
    setGameState("showing");
    setShowingIndex(0);
  }, [level, generateSequence]);

  // Show sequence animation
  useEffect(() => {
    if (gameState !== "showing") return;

    if (showingIndex >= sequence.length) {
      setGameState("input");
      setShowingIndex(-1);
      return;
    }

    const timer = setTimeout(() => {
      setShowingIndex((i) => i + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [gameState, showingIndex, sequence.length]);

  const handleNumberClick = (num: number) => {
    if (gameState !== "input") return;

    const newUserSequence = [...userSequence, num];
    setUserSequence(newUserSequence);

    const currentIndex = newUserSequence.length - 1;

    // Check if wrong
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      setGameState("wrong");
      if (level > bestLevel) {
        setBestLevel(level);
      }
      setTimeout(() => setGameState("finished"), 1500);
      return;
    }

    // Check if complete
    if (newUserSequence.length === sequence.length) {
      const points = level * 10;
      setScore((s) => s + points);
      setGameState("correct");
      setTimeout(() => nextLevel(), 1000);
    }
  };

  // Award points when game finishes
  useEffect(() => {
    if (gameState === "finished" && isLoggedIn && score > 0) {
      const points = Math.floor(score / 5) + (level > 5 ? 10 : 0);
      if (points > 0) {
        addPoints("number-sequence", points, { score, level: level - 1 });
        setPointsEarned(points);
      }
    }
  }, [gameState, isLoggedIn, score, level, addPoints]);

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
            </div>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Number Sequence
          </h1>
          <p className="text-[var(--muted)]">
            Remember and repeat the number sequence!
          </p>
        </div>

        {/* Ready State */}
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">🔢</div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Test Your Memory
            </h2>
            <p className="text-[var(--muted)] mb-6">
              Watch the numbers appear, then repeat the sequence in the same order.
              The sequence gets longer with each level!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Showing State */}
        {gameState === "showing" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)]">
            <div className="text-center mb-8">
              <p className="text-lg text-[var(--muted)] mb-4">Remember this sequence...</p>
              <div className="h-24 flex items-center justify-center">
                {showingIndex >= 0 && showingIndex < sequence.length && (
                  <span className="text-7xl font-bold text-[var(--primary)] animate-pulse">
                    {sequence[showingIndex]}
                  </span>
                )}
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {sequence.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i <= showingIndex ? "bg-[var(--primary)]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input State */}
        {(gameState === "input" || gameState === "correct" || gameState === "wrong") && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)]">
            <div className="text-center mb-6">
              <p className="text-lg text-[var(--muted)] mb-4">
                {gameState === "input" && "Now repeat the sequence!"}
                {gameState === "correct" && "Correct! Get ready for the next level..."}
                {gameState === "wrong" && "Wrong sequence!"}
              </p>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {sequence.map((num, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
                      i < userSequence.length
                        ? userSequence[i] === num
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i < userSequence.length ? userSequence[i] : "?"}
                  </div>
                ))}
              </div>

              {gameState === "wrong" && (
                <p className="text-sm text-[var(--muted)] mb-4">
                  Correct sequence: {sequence.join(" - ")}
                </p>
              )}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  disabled={gameState !== "input"}
                  className="aspect-square text-2xl font-bold bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
                >
                  {num}
                </button>
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

            {isLoggedIn && pointsEarned > 0 && (
              <p className="text-sm text-green-600 font-medium mb-4">
                +{pointsEarned} points earned!
              </p>
            )}
            {!isLoggedIn && !loading && (
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
            <li>• Try chunking numbers into groups</li>
            <li>• Create a rhythm or pattern in your mind</li>
            <li>• Say the numbers silently as they appear</li>
            <li>• Regular practice improves working memory</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
