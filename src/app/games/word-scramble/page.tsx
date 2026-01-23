"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const words = [
  { word: "GROWTH", hint: "Personal development" },
  { word: "MINDFUL", hint: "Being present and aware" },
  { word: "SUCCESS", hint: "Achievement of goals" },
  { word: "COURAGE", hint: "Bravery in facing challenges" },
  { word: "WISDOM", hint: "Knowledge and good judgment" },
  { word: "PATIENCE", hint: "Ability to wait calmly" },
  { word: "BALANCE", hint: "Equilibrium in life" },
  { word: "FOCUS", hint: "Concentrated attention" },
  { word: "HARMONY", hint: "Peace and agreement" },
  { word: "INSPIRE", hint: "Motivate others" },
  { word: "GRATEFUL", hint: "Feeling thankful" },
  { word: "RESILIENT", hint: "Able to recover quickly" },
  { word: "CREATIVE", hint: "Having imagination" },
  { word: "EMPATHY", hint: "Understanding others' feelings" },
  { word: "PERSIST", hint: "Continue despite difficulty" },
  { word: "THRIVE", hint: "Grow vigorously" },
  { word: "ACHIEVE", hint: "Accomplish a goal" },
  { word: "PASSION", hint: "Strong enthusiasm" },
  { word: "BELIEVE", hint: "Have faith in" },
  { word: "IMPROVE", hint: "Make better" },
];

function scrambleWord(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Make sure it's actually scrambled
  if (arr.join("") === word) {
    return scrambleWord(word);
  }
  return arr.join("");
}

export default function WordScrambleGame() {
  const { user, loading, addPoints } = useAuth();
  const isLoggedIn = !loading && !!user;
  const [currentWord, setCurrentWord] = useState<{ word: string; hint: string } | null>(null);
  const [scrambled, setScrambled] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameState, setGameState] = useState<"ready" | "playing" | "correct" | "wrong" | "finished">("ready");
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const maxRounds = 10;

  const getNewWord = useCallback(() => {
    const available = words.filter((w) => !usedWords.includes(w.word));
    if (available.length === 0) {
      setUsedWords([]);
      return words[Math.floor(Math.random() * words.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  }, [usedWords]);

  const startGame = useCallback(() => {
    const newWord = getNewWord();
    setCurrentWord(newWord);
    setScrambled(scrambleWord(newWord.word));
    setUserGuess("");
    setScore(0);
    setRound(1);
    setGameState("playing");
    setUsedWords([newWord.word]);
    setShowHint(false);
    setPointsEarned(0);
  }, [getNewWord]);

  const nextRound = useCallback(() => {
    if (round >= maxRounds) {
      setGameState("finished");
      return;
    }
    const newWord = getNewWord();
    setCurrentWord(newWord);
    setScrambled(scrambleWord(newWord.word));
    setUserGuess("");
    setRound((r) => r + 1);
    setUsedWords((prev) => [...prev, newWord.word]);
    setShowHint(false);
    setGameState("playing");
  }, [round, getNewWord]);

  const checkAnswer = () => {
    if (!currentWord) return;
    if (userGuess.toUpperCase() === currentWord.word) {
      const points = showHint ? 5 : 10;
      setScore((s) => s + points);
      setGameState("correct");
      setTimeout(() => {
        if (round >= maxRounds) {
          setGameState("finished");
        } else {
          nextRound();
        }
      }, 1000);
    } else {
      setGameState("wrong");
      setTimeout(() => setGameState("playing"), 1000);
    }
  };

  // Award points when game finishes
  useEffect(() => {
    if (gameState === "finished" && isLoggedIn && score > 0) {
      const points = Math.floor(score / 2);
      if (points > 0) {
        addPoints("word-scramble", points, { score, rounds: maxRounds });
        setPointsEarned(points);
      }
    }
  }, [gameState, isLoggedIn, score, addPoints]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && gameState === "playing") {
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
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[var(--muted)]">
              Round: <strong className="text-[var(--foreground)]">{round}/{maxRounds}</strong>
            </span>
            <span className="text-[var(--muted)]">
              Score: <strong className="text-green-600">{score}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Word Scramble
          </h1>
          <p className="text-[var(--muted)]">
            Unscramble the letters to form the correct word!
          </p>
        </div>

        {/* Ready State */}
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Ready to Unscramble?
            </h2>
            <p className="text-[var(--muted)] mb-6">
              You&apos;ll have {maxRounds} words to unscramble. Use hints if you get stuck!
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
        {(gameState === "playing" || gameState === "correct" || gameState === "wrong") && currentWord && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)]">
            <div className="text-center mb-8">
              <div className="flex justify-center gap-2 mb-6">
                {scrambled.split("").map((letter, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 bg-[var(--primary)] text-white rounded-lg flex items-center justify-center text-2xl font-bold"
                  >
                    {letter}
                  </div>
                ))}
              </div>

              {showHint && (
                <p className="text-sm text-[var(--muted)] mb-4">
                  Hint: {currentWord.hint}
                </p>
              )}

              <input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                className={`w-full max-w-xs px-6 py-4 text-xl text-center border-2 rounded-xl focus:outline-none font-mono uppercase ${
                  gameState === "correct"
                    ? "border-green-500 bg-green-50"
                    : gameState === "wrong"
                    ? "border-red-500 bg-red-50"
                    : "border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/20"
                }`}
                placeholder="Your answer..."
                autoComplete="off"
                disabled={gameState !== "playing"}
              />

              {gameState === "correct" && (
                <p className="text-green-600 font-semibold mt-4">Correct! +{showHint ? 5 : 10} points</p>
              )}
              {gameState === "wrong" && (
                <p className="text-red-600 font-semibold mt-4">Try again!</p>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={checkAnswer}
                disabled={gameState !== "playing" || !userGuess}
                className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
              >
                Submit
              </button>
              {!showHint && gameState === "playing" && (
                <button
                  onClick={() => setShowHint(true)}
                  className="px-8 py-3 bg-gray-100 text-[var(--foreground)] rounded-full font-semibold hover:bg-gray-200 transition-colors"
                >
                  Show Hint (-5 pts)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Finished State */}
        {gameState === "finished" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">
              {score >= 80 ? "🏆" : score >= 50 ? "⭐" : "👍"}
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
      </div>
    </div>
  );
}
