"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const EMOJIS = ["🎯", "🧠", "⭐", "🔥", "💡", "🚀", "💪", "🎨"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function createCards(): Card[] {
  const cards: Card[] = [];
  EMOJIS.forEach((emoji, index) => {
    cards.push({ id: index * 2, emoji, isFlipped: false, isMatched: false });
    cards.push({ id: index * 2 + 1, emoji, isFlipped: false, isMatched: false });
  });
  return shuffleArray(cards);
}

export default function MemoryMatchGame() {
  const { user, loading, addPoints } = useAuth();
  const [cards, setCards] = useState<Card[]>(createCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  useEffect(() => {
    if (matches === EMOJIS.length && startTime && !endTime) {
      const completionTime = Date.now();
      setEndTime(completionTime);
      setGameComplete(true);

      // Award points if user is logged in and points not yet awarded
      if (user && !pointsAwarded) {
        const timeInSeconds = Math.floor((completionTime - startTime) / 1000);
        const baseScore = 1000;
        const timeBonus = Math.max(0, 300 - timeInSeconds);
        const movesPenalty = moves * 5;
        const score = Math.max(10, Math.floor((baseScore + timeBonus - movesPenalty) / 10));

        addPoints("memory_match", score, { moves, time: timeInSeconds });
        setPointsAwarded(true);
      }
    }
  }, [matches, startTime, endTime, user, addPoints, pointsAwarded, moves]);

  const handleCardClick = (cardId: number) => {
    if (isProcessing) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          )
        );
        setMatches((prev) => prev + 1);
        setFlippedCards([]);
        setIsProcessing(false);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(createCards());
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
    setStartTime(null);
    setEndTime(null);
    setIsProcessing(false);
    setPointsAwarded(false);
  };

  const calculateScore = () => {
    if (!startTime || !endTime) return 0;
    const timeInSeconds = Math.floor((endTime - startTime) / 1000);
    const baseScore = 1000;
    const timeBonus = Math.max(0, 300 - timeInSeconds);
    const movesPenalty = moves * 5;
    return Math.max(0, baseScore + timeBonus - movesPenalty);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fade-in min-h-screen bg-gradient-to-br from-[var(--secondary)] to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Games
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Memory Match</h1>
          <p className="text-[var(--muted)]">Find all matching pairs to win!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[var(--primary)]">{moves}</p>
            <p className="text-sm text-[var(--muted)]">Moves</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[var(--primary)]">
              {matches}/{EMOJIS.length}
            </p>
            <p className="text-sm text-[var(--muted)]">Matches</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[var(--primary)]">
              {startTime && !gameComplete
                ? formatTime(Date.now() - startTime)
                : endTime && startTime
                ? formatTime(endTime - startTime)
                : "0:00"}
            </p>
            <p className="text-sm text-[var(--muted)]">Time</p>
          </div>
        </div>

        {/* Game Board */}
        {gameComplete ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              Congratulations!
            </h2>
            <p className="text-[var(--muted)] mb-6">
              You completed the game in {moves} moves!
            </p>
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl p-6 mb-6">
              <p className="text-sm mb-1">Your Score</p>
              <p className="text-4xl font-bold">{calculateScore()}</p>
              <p className="text-sm mt-2 text-white/80">
                Time: {endTime && startTime ? formatTime(endTime - startTime) : "N/A"}
              </p>
              {user && pointsAwarded && (
                <p className="text-sm mt-2 text-green-300 font-medium">
                  +{Math.max(10, Math.floor(calculateScore() / 10))} points added to your account!
                </p>
              )}
              {!user && !loading && (
                <p className="text-sm mt-2 text-yellow-300">
                  <Link href="/auth" className="underline">Sign in</Link> to save your points!
                </p>
              )}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-[var(--primary)] text-white rounded-full font-medium hover:bg-[var(--primary-dark)] transition-colors"
              >
                Play Again
              </button>
              <Link
                href="/games"
                className="px-6 py-3 bg-white text-[var(--primary)] border-2 border-[var(--primary)] rounded-full font-medium hover:bg-[var(--secondary)] transition-colors"
              >
                More Games
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-4 gap-3">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isFlipped || card.isMatched || isProcessing}
                  className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all duration-300 transform ${
                    card.isFlipped || card.isMatched
                      ? "bg-[var(--primary)] rotate-0 scale-100"
                      : "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] hover:scale-105"
                  } ${card.isMatched ? "opacity-50" : ""}`}
                >
                  {card.isFlipped || card.isMatched ? (
                    <span className="text-white">{card.emoji}</span>
                  ) : (
                    <span className="text-white/30 text-2xl">?</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={resetGame}
              className="w-full mt-6 px-6 py-3 bg-[var(--secondary)] text-[var(--primary)] rounded-full font-medium hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              Reset Game
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
          <h3 className="font-semibold text-[var(--foreground)] mb-2">Tips</h3>
          <ul className="text-sm text-[var(--muted)] space-y-1">
            <li>• Try to remember the position of cards you've seen</li>
            <li>• Focus on one area of the board at a time</li>
            <li>• Fewer moves = higher score</li>
            <li>• Speed matters too - complete quickly for bonus points!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
