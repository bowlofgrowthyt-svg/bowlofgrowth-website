"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

const breathingPatterns = {
  "4-7-8": { inhale: 4, hold: 7, exhale: 8, rest: 0, name: "4-7-8 Relaxation" },
  "box": { inhale: 4, hold: 4, exhale: 4, rest: 4, name: "Box Breathing" },
  "energizing": { inhale: 4, hold: 0, exhale: 4, rest: 0, name: "Energizing Breath" },
};

type PatternKey = keyof typeof breathingPatterns;

export default function BreathingExerciseGame() {
  const { user, loading, addPoints } = useAuth();
  const isLoggedIn = !loading && !!user;
  const [selectedPattern, setSelectedPattern] = useState<PatternKey>("box");
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [timer, setTimer] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [pointsEarned, setPointsEarned] = useState(0);
  const [circleScale, setCircleScale] = useState(1);

  const pattern = breathingPatterns[selectedPattern];

  const getPhaseTime = useCallback((p: BreathPhase) => {
    switch (p) {
      case "inhale": return pattern.inhale;
      case "hold": return pattern.hold;
      case "exhale": return pattern.exhale;
      case "rest": return pattern.rest;
    }
  }, [pattern]);

  const getNextPhase = useCallback((currentPhase: BreathPhase): BreathPhase => {
    const phases: BreathPhase[] = ["inhale", "hold", "exhale", "rest"];
    const currentIndex = phases.indexOf(currentPhase);

    // Find next phase with non-zero duration
    for (let i = 1; i <= 4; i++) {
      const nextIndex = (currentIndex + i) % 4;
      const nextPhase = phases[nextIndex];
      if (getPhaseTime(nextPhase) > 0) {
        return nextPhase;
      }
    }
    return "inhale";
  }, [getPhaseTime]);

  const startSession = useCallback(() => {
    setPhase("inhale");
    setTimer(pattern.inhale);
    setCyclesCompleted(0);
    setPointsEarned(0);
    setCircleScale(1);
    setGameState("playing");
  }, [pattern]);

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          // Move to next phase
          const nextPhase = getNextPhase(phase);

          // Check if we completed a cycle
          if (nextPhase === "inhale") {
            const newCycles = cyclesCompleted + 1;
            setCyclesCompleted(newCycles);

            if (newCycles >= totalCycles) {
              setGameState("finished");
              return 0;
            }
          }

          setPhase(nextPhase);
          return getPhaseTime(nextPhase);
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, phase, cyclesCompleted, totalCycles, getNextPhase, getPhaseTime]);

  // Circle animation
  useEffect(() => {
    if (gameState !== "playing") return;

    const phaseTime = getPhaseTime(phase);
    if (phaseTime === 0) return;

    if (phase === "inhale") {
      // Expand during inhale
      const progress = 1 - (timer / phaseTime);
      setCircleScale(1 + progress * 0.5);
    } else if (phase === "exhale") {
      // Contract during exhale
      const progress = timer / phaseTime;
      setCircleScale(1 + progress * 0.5);
    }
    // Hold phases keep the current scale
  }, [gameState, phase, timer, getPhaseTime]);

  // Award points when session finishes
  useEffect(() => {
    if (gameState === "finished" && isLoggedIn) {
      const points = cyclesCompleted * 6;
      if (points > 0) {
        addPoints("breathing-exercise", points, { cycles: cyclesCompleted, pattern: selectedPattern });
        setPointsEarned(points);
      }
    }
  }, [gameState, isLoggedIn, cyclesCompleted, selectedPattern, addPoints]);

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale": return "#22C55E";
      case "hold": return "#3B82F6";
      case "exhale": return "#F59E0B";
      case "rest": return "#8B5CF6";
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "rest": return "Rest";
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
            <div className="text-sm text-[var(--muted)]">
              Cycle: <strong className="text-[var(--foreground)]">{cyclesCompleted + 1}/{totalCycles}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Mindful Breathing
          </h1>
          <p className="text-[var(--muted)]">
            Follow the circle and calm your mind
          </p>
        </div>

        {/* Ready State */}
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)]">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🧘</div>
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                Choose Your Breathing Pattern
              </h2>
            </div>

            <div className="grid gap-4 mb-8 max-w-md mx-auto">
              {(Object.keys(breathingPatterns) as PatternKey[]).map((key) => {
                const p = breathingPatterns[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedPattern(key)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedPattern === key
                        ? "border-[var(--primary)] bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-[var(--foreground)]">{p.name}</p>
                    <p className="text-sm text-[var(--muted)]">
                      Inhale {p.inhale}s
                      {p.hold > 0 && ` • Hold ${p.hold}s`}
                      {` • Exhale ${p.exhale}s`}
                      {p.rest > 0 && ` • Rest ${p.rest}s`}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="text-center mb-8">
              <p className="text-sm text-[var(--muted)] mb-2">Number of cycles:</p>
              <div className="flex items-center justify-center gap-4">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTotalCycles(num)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      totalCycles === num
                        ? "bg-[var(--primary)] text-white"
                        : "bg-gray-100 text-[var(--foreground)] hover:bg-gray-200"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startSession}
                className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors"
              >
                Start Session
              </button>
            </div>
          </div>
        )}

        {/* Playing State */}
        {gameState === "playing" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)]">
            <div className="text-center">
              {/* Breathing Circle */}
              <div className="relative w-64 h-64 mx-auto mb-8">
                <div
                  className="absolute inset-0 rounded-full transition-transform duration-1000 ease-in-out flex items-center justify-center"
                  style={{
                    backgroundColor: getPhaseColor(),
                    transform: `scale(${circleScale})`,
                    opacity: 0.9,
                  }}
                >
                  <div className="text-white text-center">
                    <p className="text-5xl font-bold">{timer}</p>
                  </div>
                </div>
              </div>

              <p
                className="text-3xl font-semibold mb-4 transition-colors"
                style={{ color: getPhaseColor() }}
              >
                {getPhaseInstruction()}
              </p>

              {/* Progress */}
              <div className="flex justify-center gap-2 mb-6">
                {Array.from({ length: totalCycles }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < cyclesCompleted
                        ? "bg-green-500"
                        : i === cyclesCompleted
                        ? "bg-[var(--primary)]"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setGameState("ready")}
                className="px-6 py-2 bg-gray-100 text-[var(--foreground)] rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Stop Session
              </button>
            </div>
          </div>
        )}

        {/* Finished State */}
        {gameState === "finished" && (
          <div className="bg-white rounded-2xl p-8 border border-[var(--border)] text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Session Complete!
            </h2>
            <p className="text-[var(--muted)] mb-6">
              You completed {cyclesCompleted} breathing cycles. Take a moment to notice how you feel.
            </p>

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

            <div className="flex gap-4 justify-center">
              <button
                onClick={startSession}
                className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors"
              >
                Another Session
              </button>
              <button
                onClick={() => setGameState("ready")}
                className="px-8 py-3 bg-gray-100 text-[var(--foreground)] rounded-full font-semibold hover:bg-gray-200 transition-colors"
              >
                Change Pattern
              </button>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-8 bg-[var(--secondary)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-3">Benefits of Breathing Exercises</h3>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>• <strong>4-7-8:</strong> Promotes deep relaxation and better sleep</li>
            <li>• <strong>Box Breathing:</strong> Used by Navy SEALs for stress management</li>
            <li>• <strong>Energizing:</strong> Quick way to boost alertness and focus</li>
            <li>• Regular practice reduces anxiety and improves emotional regulation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
