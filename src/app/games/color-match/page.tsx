"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const colors = [
  { name: "RED", hex: "#EF4444" },
  { name: "BLUE", hex: "#3B82F6" },
  { name: "GREEN", hex: "#22C55E" },
  { name: "YELLOW", hex: "#EAB308" },
  { name: "PURPLE", hex: "#A855F7" },
  { name: "ORANGE", hex: "#F97316" },
];

function generateStroopWord(): { word: string; displayColor: string; correctColor: string } {
  const wordColor = colors[Math.floor(Math.random() * colors.length)];
  let displayColor = colors[Math.floor(Math.random() * colors.length)];

  // 70% chance for incongruent (word and color don't match)
  if (Math.random() < 0.7 && displayColor.name === wordColor.name) {
    const otherColors = colors.filter((c) => c.name !== wordColor.name);
    displayColor = otherColors[Math.floor(Math.random() * otherColors.length)];
  }

  return {
    word: wordColor.name,
    displayColor: displayColor.hex,
    correctColor: displayColor.name,
  };
}

export default function ColorMatchGame() {
  const { user, loading, addPoints } = useAuth();
  const [current, setCurrent] = useState<{ word: string; displayColor: string; correctColor: string } | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [gameState, setGameState] = useState<"ready" | "playing" | "correct" | "wrong" | "finished">("ready");
  const [pointsEarned, setPointsEarned] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [options, setOptions] = useState<{ name: string; hex: string }[]>([]);

  const maxRounds = 20;

  const nextRound = useCallback(() => {
    const newWord = generateStroopWord();
    setCurrent(newWord);

    // Generate options (always include correct answer)
    const correctColor = colors.find((c) => c.name === newWord.correctColor)!;
    const otherColors = colors.filter((c) => c.name !== newWord.correctColor);
    const shuffled = otherColors.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correctColor, ...shuffled].sort(() => Math.random() - 0.5);
    setOptions(allOptions);

    setRound((r) => r + 1);
    setGameState("playing");
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setRound(0);
    setPointsEarned(0);
    setPointsAwarded(false);
    nextRound();
  }, [nextRound]);

  const handleAnswer = (colorName: string) => {
    if (gameState !== "playing" || !current) return;

    const isCorrect = colorName === current.correctColor;

    if (isCorrect) {
      setScore((s) => s + 10);
      setGameState("correct");
      setTimeout(() => {
        if (round >= maxRounds) {
          setGameState("finished");
        } else {
          nextRound();
        }
      }, 500);
    } else {
      setLives((l) => l - 1);
      setGameState("wrong");
      setTimeout(() => {
        if (lives <= 1) {
          setGameState("finished");
        } else {
          nextRound();
        }
      }, 500);
    }
  };

  // Award points when game finishes
  useEffect(() => {
    if (gameState === "finished" && user && !pointsAwarded && score > 0) {
      const points = Math.floor(score / 3);
      if (points > 0) {
        setPointsAwarded(true);
        addPoints("color-match", points, { score, rounds: round }).then((result) => {
          if (!result.error) {
            setPointsEarned(points);
          } else {
            setPointsAwarded(false);
          }
        });
      }
    }
  }, [gameState, user, pointsAwarded, score, round, addPoints]);

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
            Color Match
          </h1>
          <p className="text-[var(--muted)]">
            Select the COLOR of the word, not what it says!
          </p>
        </div>

        {/* Ready State */}
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              The Stroop Test
            </h2>
            <p className="text-[var(--muted)] mb-4">
              You&apos;ll see color words displayed in different colors.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 max-w-sm mx-auto">
              <p className="text-sm text-[var(--muted)] mb-2">Example:</p>
              <p className="text-3xl font-bold" style={{ color: "#3B82F6" }}>RED</p>
              <p className="text-sm text-[var(--muted)] mt-2">
                The answer is <strong>BLUE</strong> (the color), not RED (the word)
              </p>
            </div>
            <p className="text-sm text-[var(--muted)] mb-6">You have 3 lives. Don&apos;t lose them all!</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Playing State */}
        {(gameState === "playing" || gameState === "correct" || gameState === "wrong") && current && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)]">
            <div className="text-center mb-8">
              <p className="text-sm text-[var(--muted)] mb-4">What COLOR is this word?</p>
              <div
                className={`py-8 rounded-xl mb-6 ${
                  gameState === "correct"
                    ? "bg-green-50"
                    : gameState === "wrong"
                    ? "bg-red-50"
                    : "bg-gray-50"
                }`}
              >
                <p
                  className="text-6xl font-bold"
                  style={{ color: current.displayColor }}
                >
                  {current.word}
                </p>
              </div>

              {gameState === "correct" && (
                <p className="text-green-600 font-semibold mb-4">Correct! +10</p>
              )}
              {gameState === "wrong" && (
                <p className="text-red-600 font-semibold mb-4">
                  Wrong! The color was {current.correctColor}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {options.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleAnswer(color.name)}
                    disabled={gameState !== "playing"}
                    className="py-4 px-6 rounded-xl font-bold text-white text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    style={{ backgroundColor: color.hex }}
                  >
                    {color.name}
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
              {score >= 150 ? "🏆" : score >= 100 ? "⭐" : "👍"}
            </div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              {lives > 0 ? "Game Complete!" : "Game Over!"}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs mx-auto">
              <div className="bg-[var(--secondary)] rounded-xl p-4">
                <p className="text-3xl font-bold text-[var(--primary)]">{score}</p>
                <p className="text-sm text-[var(--muted)]">Score</p>
              </div>
              <div className="bg-[var(--secondary)] rounded-xl p-4">
                <p className="text-3xl font-bold text-green-600">{round}</p>
                <p className="text-sm text-[var(--muted)]">Rounds</p>
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

        {/* Info */}
        <div className="mt-8 bg-[var(--secondary)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-3">About the Stroop Effect</h3>
          <p className="text-sm text-[var(--muted)]">
            The Stroop effect demonstrates the interference in the reaction time of a task.
            When the name of a color is printed in a different color, it takes longer to name the
            actual color because reading is an automatic process that interferes with color naming.
          </p>
        </div>
      </div>
    </div>
  );
}
