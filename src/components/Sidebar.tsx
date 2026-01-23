import Link from "next/link";
import { getCategoriesWithCounts } from "@/data/categories";
import { getDailyQuote } from "@/data/quotes";
import QuoteCard from "./QuoteCard";

export default function Sidebar() {
  const quote = getDailyQuote();
  const categoriesWithCounts = getCategoriesWithCounts();

  return (
    <aside className="space-y-8">
      {/* Daily Quote */}
      <div>
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center text-sm">
            ✨
          </span>
          Today&apos;s Inspiration
        </h3>
        <QuoteCard quote={quote} />
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6">
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center text-sm">
            📚
          </span>
          Categories
        </h3>
        <ul className="space-y-2">
          {categoriesWithCounts.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--secondary)] transition-colors group"
              >
                <span className="text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors">
                  {cat.name}
                </span>
                <span className="text-xs text-[var(--muted)] bg-gray-100 px-2 py-1 rounded-full">
                  {cat.articleCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Get Daily Wisdom</h3>
        <p className="text-white/80 text-sm mb-4">
          Join readers receiving daily inspiration in their inbox.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/50"
          />
          <button
            type="submit"
            className="w-full py-3 bg-white text-[var(--primary)] rounded-xl font-semibold text-sm hover:bg-purple-50 transition-colors"
          >
            Subscribe Free
          </button>
        </form>
        <p className="text-xs text-white/60 mt-3 text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>

      {/* Brain Games CTA */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6">
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm">
            🧠
          </span>
          Train Your Brain
        </h3>
        <p className="text-sm text-[var(--muted)] mb-4">
          Play fun games to boost memory, focus, and mental agility.
        </p>
        <Link
          href="/games"
          className="block w-full py-3 bg-green-500 text-white text-center rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors"
        >
          Play Now
        </Link>
      </div>
    </aside>
  );
}
