import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brain Games",
  description: "Challenge your mind with fun brain training games. Improve memory, focus, and cognitive skills.",
};

const games = [
  {
    id: "memory-match",
    name: "Memory Match",
    description: "Test your memory by matching pairs of cards. The faster you complete, the more points you earn!",
    icon: "🧠",
    difficulty: "Easy",
    color: "#10B981",
    points: 50,
    available: true,
  },
  {
    id: "number-sequence",
    name: "Number Sequence",
    description: "Remember and repeat increasingly longer number sequences to train your working memory.",
    icon: "🔢",
    difficulty: "Medium",
    color: "#F59E0B",
    points: 75,
    available: false,
  },
  {
    id: "word-scramble",
    name: "Word Scramble",
    description: "Unscramble letters to form meaningful words. Great for vocabulary and quick thinking.",
    icon: "📝",
    difficulty: "Easy",
    color: "#3B82F6",
    points: 40,
    available: false,
  },
  {
    id: "focus-trainer",
    name: "Focus Trainer",
    description: "Click targets as they appear while ignoring distractions. Perfect for attention training.",
    icon: "🎯",
    difficulty: "Hard",
    color: "#EC4899",
    points: 100,
    available: false,
  },
  {
    id: "pattern-recognition",
    name: "Pattern Recognition",
    description: "Identify the next element in various visual and numerical patterns.",
    icon: "🔮",
    difficulty: "Medium",
    color: "#8B5CF6",
    points: 60,
    available: false,
  },
  {
    id: "speed-math",
    name: "Speed Math",
    description: "Solve math problems as quickly as possible. Race against the clock!",
    icon: "➕",
    difficulty: "Hard",
    color: "#EF4444",
    points: 80,
    available: false,
  },
];

export default function GamesPage() {
  return (
    <div className="fade-in">
      {/* Header */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
              Brain Training
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Train Your Brain, Earn Points
            </h1>
            <p className="text-white/80">
              Challenge yourself with fun cognitive games. Track your progress,
              earn points, and watch your mental fitness improve over time.
            </p>
          </div>
        </div>
      </section>

      {/* Stats (placeholder for logged in users) */}
      <section className="py-8 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[var(--primary)]">0</p>
              <p className="text-sm text-[var(--muted)]">Games Played</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--primary)]">0</p>
              <p className="text-sm text-[var(--muted)]">Points Earned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--primary)]">0</p>
              <p className="text-sm text-[var(--muted)]">Day Streak</p>
            </div>
          </div>
          <p className="text-center text-sm text-[var(--muted)] mt-4">
            <Link href="/auth" className="text-[var(--primary)] hover:underline">
              Sign in
            </Link>{" "}
            to track your progress and earn points!
          </p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">
            Available Games
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className={`bg-white rounded-xl p-6 shadow-sm border border-[var(--border)] ${
                  game.available ? "hover-lift" : "opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: game.color + "20" }}
                  >
                    {game.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          game.difficulty === "Easy"
                            ? "#10B98120"
                            : game.difficulty === "Medium"
                            ? "#F59E0B20"
                            : "#EF444420",
                        color:
                          game.difficulty === "Easy"
                            ? "#10B981"
                            : game.difficulty === "Medium"
                            ? "#F59E0B"
                            : "#EF4444",
                      }}
                    >
                      {game.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                  {game.name}
                </h3>
                <p className="text-sm text-[var(--muted)] mb-4">{game.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--primary)] font-medium">
                    +{game.points} points
                  </span>
                  {game.available ? (
                    <Link
                      href={`/games/${game.id}`}
                      className="px-4 py-2 bg-[var(--primary)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors"
                    >
                      Play Now
                    </Link>
                  ) : (
                    <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-full text-sm font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-16 bg-[var(--secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)] text-center mb-12">
            Why Train Your Brain?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Improve Memory</h3>
              <p className="text-[var(--muted)]">
                Regular brain training helps strengthen neural connections and improve recall.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Boost Focus</h3>
              <p className="text-[var(--muted)]">
                Train your attention span and learn to concentrate better in daily life.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Have Fun</h3>
              <p className="text-[var(--muted)]">
                Learning and growth should be enjoyable. Our games make training fun!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
