"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

type Operation = "+" | "-" | "×";

function generateProblem(difficulty: number): { num1: number; num2: number; operation: Operation; answer: number } {
  const operations: Operation[] = ["+", "-", "×"];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let num1: number, num2: number, answer: number;
  const maxNum = Math.min(10 + difficulty * 5, 50);

  switch (operation) {
    case "+":
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * maxNum) + 1;
      answer = num1 + num2;
      break;
    case "-":
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
      break;
    case "×":
      num1 = Math.floor(Math.random() * Math.min(12, maxNum / 2)) + 1;
      num2 = Math.floor(Math.random() * Math.min(12, maxNum / 2)) + 1;
      answer = num1 * num2;
      break;
  }

  return { num1, num2, operation, answer };
}

export default function SpeedMathGame() {
  const { user, loading, addPoints } = useAuth();
  const [problem, setProblem] = useState<{ num1: number; num2: number; operation: Operation; answer: number } | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem(Math.floor(problemsSolved / 5)));
    setUserAnswer("");
    setFeedback(null);
  }, [problemsSolved]);

  const startGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setProblemsSolved(0);
    setPointsEarned(0);
    setPointsAwarded(false);
    setGameState("playing");
    setProblem(generateProblem(0));
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;

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
  }, [gameState]);

  // Award points when game finishes
  useEffect(() => {
    if (gameState === "finished" && user && !pointsAwarded && score > 0) {
      const points = Math.floor(score / 10) + Math.floor(problemsSolved / 2);
      if (points > 0) {
        setPointsAwarded(true);
        addPoints("speed-math", points, { score, problemsSolved }).then((result) => {
          if (!result.error) {
            setPointsEarned(points);
          } else {
            setPointsAwarded(false);
          }
        });
      }
    }
  }, [gameState, user, pointsAwarded, score, problemsSolved, addPoints]);

  const checkAnswer = () => {
    if (!problem || !userAnswer) return;

    const isCorrect = parseInt(userAnswer) === problem.answer;
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      const points = 10 + streak * 2;
      setScore((s) => s + points);
      setStreak((s) => s + 1);
      setProblemsSolved((p) => p + 1);
      setTimeout(() => nextProblem(), 300);
    } else {
      setStreak(0);
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer("");
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
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
                Score: <strong className="text-green-600">{score}</strong>
              </span>
              {streak > 1 && (
                <span className="text-orange-500 font-semibold">
                  {streak}x streak!
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Speed Math
          </h1>
          <p className="text-[var(--muted)]">
            Solve math problems as fast as you can!
          </p>
        </div>

        {/* Ready State */}
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">➕</div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Ready to Calculate?
            </h2>
            <p className="text-[var(--muted)] mb-6">
              You have 60 seconds to solve as many problems as you can!<br />
              Build streaks for bonus points!
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
        {gameState === "playing" && problem && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)]">
            <div className="text-center">
              {/* Timer Bar */}
              <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${timeLeft <= 10 ? "bg-red-500" : "bg-[var(--primary)]"}`}
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                />
              </div>

              {/* Problem Display */}
              <div className="mb-8">
                <p className="text-5xl font-bold text-[var(--foreground)] mb-8">
                  {problem.num1} {problem.operation} {problem.num2} = ?
                </p>

                <input
                  ref={inputRef}
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-32 px-6 py-4 text-3xl text-center border-2 rounded-xl focus:outline-none font-mono ${
                    feedback === "correct"
                      ? "border-green-500 bg-green-50"
                      : feedback === "wrong"
                      ? "border-red-500 bg-red-50 animate-shake"
                      : "border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/20"
                  }`}
                  autoComplete="off"
                />

                {feedback === "correct" && (
                  <p className="text-green-600 font-semibold mt-4">
                    Correct! +{10 + (streak - 1) * 2}
                  </p>
                )}
              </div>

              <button
                onClick={checkAnswer}
                disabled={!userAnswer}
                className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Finished State */}
        {gameState === "finished" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">
              {score >= 200 ? "🏆" : score >= 100 ? "⭐" : "👍"}
            </div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Time&apos;s Up!
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs mx-auto">
              <div className="bg-[var(--secondary)] rounded-xl p-4">
                <p className="text-3xl font-bold text-[var(--primary)]">{score}</p>
                <p className="text-sm text-[var(--muted)]">Points</p>
              </div>
              <div className="bg-[var(--secondary)] rounded-xl p-4">
                <p className="text-3xl font-bold text-green-600">{problemsSolved}</p>
                <p className="text-sm text-[var(--muted)]">Solved</p>
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
          <h3 className="font-semibold text-[var(--foreground)] mb-3">Tips</h3>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>• Press Enter to submit your answer quickly</li>
            <li>• Build streaks for bonus points</li>
            <li>• Problems get harder as you progress</li>
            <li>• Focus on accuracy over speed initially</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
