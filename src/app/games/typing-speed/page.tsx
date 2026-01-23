"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const quotes = [
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop.",
  "The best time to plant a tree was twenty years ago. The second best time is now.",
  "Your time is limited, don't waste it living someone else's life.",
  "The only impossible journey is the one you never begin.",
  "What you get by achieving your goals is not as important as what you become.",
  "Happiness is not something ready made. It comes from your own actions.",
  "The mind is everything. What you think you become.",
  "Strive not to be a success, but rather to be of value.",
  "In the middle of every difficulty lies opportunity.",
  "Life is what happens when you're busy making other plans.",
  "The way to get started is to quit talking and begin doing.",
];

export default function TypingSpeedGame() {
  const [quote, setQuote] = useState("");
  const [userInput, setUserInput] = useState("");
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [history, setHistory] = useState<{ wpm: number; accuracy: number }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const getRandomQuote = useCallback(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  const startGame = useCallback(() => {
    const newQuote = getRandomQuote();
    setQuote(newQuote);
    setUserInput("");
    setGameState("playing");
    setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [getRandomQuote]);

  const calculateResults = useCallback(() => {
    const timeInMinutes = (endTime - startTime) / 60000;
    const wordCount = quote.split(" ").length;
    const calculatedWpm = Math.round(wordCount / timeInMinutes);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === quote[i]) {
        correctChars++;
      }
    }
    const calculatedAccuracy = Math.round((correctChars / quote.length) * 100);

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
    setHistory((prev) => [...prev, { wpm: calculatedWpm, accuracy: calculatedAccuracy }]);
  }, [endTime, startTime, quote, userInput]);

  useEffect(() => {
    if (gameState === "finished") {
      calculateResults();
    }
  }, [gameState, calculateResults]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (value === quote) {
      setEndTime(Date.now());
      setGameState("finished");
    }
  };

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) {
      return "text-gray-400"; // Not typed yet
    }
    if (userInput[index] === quote[index]) {
      return "text-green-600 bg-green-50"; // Correct
    }
    return "text-red-600 bg-red-100"; // Incorrect
  };

  const getAverageWpm = () => {
    if (history.length === 0) return 0;
    return Math.round(history.reduce((a, b) => a + b.wpm, 0) / history.length);
  };

  const getBestWpm = () => {
    if (history.length === 0) return 0;
    return Math.max(...history.map((h) => h.wpm));
  };

  const getSpeedRating = (wpm: number) => {
    if (wpm >= 80) return { text: "Lightning Fast!", emoji: "⚡", color: "#10B981" };
    if (wpm >= 60) return { text: "Very Fast!", emoji: "🚀", color: "#22C55E" };
    if (wpm >= 45) return { text: "Good Speed!", emoji: "👍", color: "#84CC16" };
    if (wpm >= 30) return { text: "Average", emoji: "😊", color: "#FBBF24" };
    return { text: "Keep Practicing!", emoji: "💪", color: "#F59E0B" };
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
              Tests: <strong className="text-[var(--foreground)]">{history.length}</strong>
            </span>
            {history.length > 0 && (
              <span className="text-[var(--muted)]">
                Best: <strong className="text-green-600">{getBestWpm()} WPM</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            ⌨️ Typing Speed Test
          </h1>
          <p className="text-[var(--muted)]">
            Test your typing speed with inspiring quotes!
          </p>
        </div>

        {/* Ready State */}
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">⌨️</div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Ready to Test Your Speed?
            </h2>
            <p className="text-[var(--muted)] mb-6">
              Type the quote as fast and accurately as you can!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              Start Typing Test
            </button>
          </div>
        )}

        {/* Playing State */}
        {gameState === "playing" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)]">
            {/* Quote Display */}
            <div className="mb-6 p-6 bg-gray-50 rounded-xl">
              <p className="text-xl leading-relaxed font-mono">
                {quote.split("").map((char, index) => (
                  <span key={index} className={`${getCharacterClass(index)} px-0.5`}>
                    {char}
                  </span>
                ))}
              </p>
            </div>

            {/* Input Field */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInput}
                className="w-full px-6 py-4 text-lg border-2 border-[var(--primary)] rounded-xl focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 font-mono"
                placeholder="Start typing here..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">
                {userInput.length} / {quote.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] transition-all duration-150"
                style={{ width: `${(userInput.length / quote.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Finished State */}
        {gameState === "finished" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">{getSpeedRating(wpm).emoji}</div>
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ color: getSpeedRating(wpm).color }}
            >
              {getSpeedRating(wpm).text}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[var(--secondary)] rounded-xl p-6">
                <p className="text-4xl font-bold text-[var(--primary)]">{wpm}</p>
                <p className="text-sm text-[var(--muted)]">Words Per Minute</p>
              </div>
              <div className="bg-[var(--secondary)] rounded-xl p-6">
                <p className="text-4xl font-bold text-green-600">{accuracy}%</p>
                <p className="text-sm text-[var(--muted)]">Accuracy</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setGameState("ready")}
                className="px-8 py-3 bg-gray-100 text-[var(--foreground)] rounded-full font-semibold hover:bg-gray-200 transition-colors"
              >
                New Quote
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        {history.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center border border-[var(--border)]">
              <p className="text-2xl font-bold text-[var(--primary)]">{history.length}</p>
              <p className="text-sm text-[var(--muted)]">Tests Taken</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-[var(--border)]">
              <p className="text-2xl font-bold text-green-600">{getBestWpm()} WPM</p>
              <p className="text-sm text-[var(--muted)]">Best Speed</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-[var(--border)]">
              <p className="text-2xl font-bold text-[var(--foreground)]">{getAverageWpm()} WPM</p>
              <p className="text-sm text-[var(--muted)]">Average</p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-[var(--secondary)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-3">💡 Typing Tips</h3>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>• Average typing speed is 40-45 WPM</li>
            <li>• Professional typists reach 65-75 WPM</li>
            <li>• Focus on accuracy first, speed will follow</li>
            <li>• Keep your fingers on the home row keys</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
