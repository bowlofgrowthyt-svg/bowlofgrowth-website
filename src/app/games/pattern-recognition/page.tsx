"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type PatternType = "number" | "letter" | "shape";

interface Pattern {
  type: PatternType;
  sequence: string[];
  answer: string;
  options: string[];
}

const numberPatterns = [
  { sequence: ["2", "4", "6", "8"], answer: "10", rule: "+2" },
  { sequence: ["1", "3", "5", "7"], answer: "9", rule: "+2" },
  { sequence: ["3", "6", "9", "12"], answer: "15", rule: "+3" },
  { sequence: ["5", "10", "15", "20"], answer: "25", rule: "+5" },
  { sequence: ["1", "2", "4", "8"], answer: "16", rule: "×2" },
  { sequence: ["2", "6", "18", "54"], answer: "162", rule: "×3" },
  { sequence: ["1", "1", "2", "3", "5"], answer: "8", rule: "fibonacci" },
  { sequence: ["1", "4", "9", "16"], answer: "25", rule: "squares" },
  { sequence: ["1", "8", "27", "64"], answer: "125", rule: "cubes" },
  { sequence: ["10", "9", "7", "4"], answer: "0", rule: "-1,-2,-3,-4" },
  { sequence: ["100", "90", "81", "73"], answer: "66", rule: "-10,-9,-8,-7" },
  { sequence: ["2", "3", "5", "7", "11"], answer: "13", rule: "primes" },
];

const letterPatterns = [
  { sequence: ["A", "C", "E", "G"], answer: "I", rule: "+2" },
  { sequence: ["Z", "X", "V", "T"], answer: "R", rule: "-2" },
  { sequence: ["A", "B", "D", "G"], answer: "K", rule: "+1,+2,+3,+4" },
  { sequence: ["B", "D", "F", "H"], answer: "J", rule: "+2" },
  { sequence: ["M", "N", "O", "P"], answer: "Q", rule: "+1" },
];

const shapePatterns = [
  { sequence: ["🔴", "🔵", "🔴", "🔵"], answer: "🔴", rule: "alternate" },
  { sequence: ["⬛", "⬛", "⬜", "⬛", "⬛"], answer: "⬜", rule: "pattern" },
  { sequence: ["🔺", "🔻", "🔺", "🔻"], answer: "🔺", rule: "alternate" },
  { sequence: ["🟢", "🟡", "🔴", "🟢", "🟡"], answer: "🔴", rule: "repeat 3" },
  { sequence: ["⭐", "⭐", "🌙", "⭐", "⭐", "🌙", "⭐"], answer: "⭐", rule: "2 stars, moon" },
];

function generateOptions(answer: string, type: PatternType): string[] {
  let possibleOptions: string[];

  if (type === "number") {
    const num = parseInt(answer);
    possibleOptions = [
      answer,
      String(num + 1),
      String(num - 1),
      String(num + 2),
      String(Math.abs(num - 2)),
    ];
  } else if (type === "letter") {
    const code = answer.charCodeAt(0);
    possibleOptions = [
      answer,
      String.fromCharCode(code + 1),
      String.fromCharCode(code - 1),
      String.fromCharCode(code + 2),
    ];
  } else {
    const shapes = ["🔴", "🔵", "🟢", "🟡", "⬛", "⬜", "🔺", "🔻", "⭐", "🌙"];
    possibleOptions = [answer];
    while (possibleOptions.length < 4) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      if (!possibleOptions.includes(shape)) {
        possibleOptions.push(shape);
      }
    }
  }

  // Ensure unique options
  const unique = [...new Set(possibleOptions)].slice(0, 4);
  while (unique.length < 4) {
    if (type === "number") {
      unique.push(String(Math.floor(Math.random() * 50)));
    } else if (type === "letter") {
      unique.push(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
    } else {
      unique.push("❓");
    }
  }

  return unique.sort(() => Math.random() - 0.5);
}

function generatePattern(): Pattern {
  const types: PatternType[] = ["number", "letter", "shape"];
  const type = types[Math.floor(Math.random() * types.length)];

  let patterns;
  if (type === "number") {
    patterns = numberPatterns;
  } else if (type === "letter") {
    patterns = letterPatterns;
  } else {
    patterns = shapePatterns;
  }

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  return {
    type,
    sequence: pattern.sequence,
    answer: pattern.answer,
    options: generateOptions(pattern.answer, type),
  };
}

export default function PatternRecognitionGame() {
  const { user, loading, addPoints } = useAuth();
  const isLoggedIn = !loading && !!user;
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState<"ready" | "playing" | "correct" | "wrong" | "finished">("ready");
  const [pointsEarned, setPointsEarned] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const maxRounds = 10;

  const nextRound = useCallback(() => {
    setPattern(generatePattern());
    setSelectedAnswer(null);
    setRound((r) => r + 1);
    setGameState("playing");
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setRound(0);
    setPointsEarned(0);
    nextRound();
  }, [nextRound]);

  const handleAnswer = (answer: string) => {
    if (gameState !== "playing" || !pattern) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === pattern.answer;

    if (isCorrect) {
      const points = 10 + streak * 5;
      setScore((s) => s + points);
      setStreak((s) => s + 1);
      setGameState("correct");
    } else {
      setStreak(0);
      setGameState("wrong");
    }

    setTimeout(() => {
      if (round >= maxRounds) {
        setGameState("finished");
      } else {
        nextRound();
      }
    }, 1500);
  };

  // Award points when game finishes
  useEffect(() => {
    if (gameState === "finished" && isLoggedIn && score > 0) {
      const points = Math.floor(score / 4);
      if (points > 0) {
        addPoints("pattern-recognition", points, { score, rounds: maxRounds });
        setPointsEarned(points);
      }
    }
  }, [gameState, isLoggedIn, score, addPoints]);

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
                Round: <strong className="text-[var(--foreground)]">{round}/{maxRounds}</strong>
              </span>
              <span className="text-[var(--muted)]">
                Score: <strong className="text-green-600">{score}</strong>
              </span>
              {streak > 1 && (
                <span className="text-orange-500 font-semibold">{streak}x streak!</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Pattern Recognition
          </h1>
          <p className="text-[var(--muted)]">
            Find the next element in the sequence!
          </p>
        </div>

        {/* Ready State */}
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Test Your Pattern Skills
            </h2>
            <p className="text-[var(--muted)] mb-6">
              You&apos;ll see sequences of numbers, letters, or shapes.
              Figure out the pattern and select what comes next!
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
        {(gameState === "playing" || gameState === "correct" || gameState === "wrong") && pattern && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)]">
            <div className="text-center mb-8">
              <p className="text-sm text-[var(--muted)] mb-4">What comes next?</p>

              {/* Sequence Display */}
              <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
                {pattern.sequence.map((item, index) => (
                  <div
                    key={index}
                    className={`w-14 h-14 rounded-lg flex items-center justify-center font-bold ${
                      pattern.type === "shape" ? "text-3xl bg-gray-100" : "text-2xl bg-[var(--primary)] text-white"
                    }`}
                  >
                    {item}
                  </div>
                ))}
                <div className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl bg-gray-200 text-gray-400">
                  ?
                </div>
              </div>

              {gameState === "correct" && (
                <p className="text-green-600 font-semibold mb-4">
                  Correct! +{10 + (streak - 1) * 5} points
                </p>
              )}
              {gameState === "wrong" && (
                <p className="text-red-600 font-semibold mb-4">
                  Wrong! The answer was {pattern.answer}
                </p>
              )}

              {/* Options */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {pattern.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={gameState !== "playing"}
                    className={`py-4 rounded-xl font-bold text-xl transition-all ${
                      selectedAnswer === option
                        ? option === pattern.answer
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : gameState !== "playing" && option === pattern.answer
                        ? "bg-green-100 text-green-700 border-2 border-green-500"
                        : "bg-gray-100 hover:bg-gray-200 text-[var(--foreground)]"
                    } disabled:cursor-not-allowed`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Finished State */}
        {gameState === "finished" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">
              {score >= 100 ? "🏆" : score >= 60 ? "⭐" : "👍"}
            </div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Game Complete!
            </h2>

            <p className="text-4xl font-bold text-[var(--primary)] mb-2">{score}</p>
            <p className="text-[var(--muted)] mb-6">points scored</p>

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
          <h3 className="font-semibold text-[var(--foreground)] mb-3">Pattern Tips</h3>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>• Look for common patterns: +2, ×2, squares, fibonacci</li>
            <li>• Check if the difference between numbers is consistent</li>
            <li>• For letters, think of their position in the alphabet</li>
            <li>• Shape patterns often alternate or repeat in groups</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
