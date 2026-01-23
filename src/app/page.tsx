import ArticleCard from "@/components/ArticleCard";
import CategoryCard from "@/components/CategoryCard";
import QuoteCard from "@/components/QuoteCard";
import { categories } from "@/data/categories";
import { getDailyQuote } from "@/data/quotes";
import { getFeaturedArticle, getRecentArticles } from "@/data/articles";
import Link from "next/link";

export default function Home() {
  const dailyQuote = getDailyQuote();
  const featuredArticle = getFeaturedArticle();
  const recentArticles = getRecentArticles(6).filter(a => !a.featured);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--secondary)] via-white to-[var(--secondary)] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm font-medium mb-4">
              Ready? Set. Grow!
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mb-6">
              Your Daily Dose of{" "}
              <span className="text-[var(--primary)]">Self-Improvement</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--muted)] mb-8">
              Discover daily motivation, book summaries, brain games, and growth strategies.
              Transform your mindset and achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/category/personal-growth"
                className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-medium hover:bg-[var(--primary-dark)] transition-colors"
              >
                Start Reading
              </Link>
              <Link
                href="/games"
                className="px-8 py-3 bg-white text-[var(--primary)] border-2 border-[var(--primary)] rounded-full font-medium hover:bg-[var(--secondary)] transition-colors"
              >
                Play Brain Games
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[var(--primary)]/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-2xl" />
      </section>

      {/* Daily Quote Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuoteCard quote={dailyQuote} />
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
                Featured Article
              </h2>
            </div>
            <ArticleCard article={featuredArticle} featured />
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
              Explore Categories
            </h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">
              Choose your area of growth and start your journey to becoming a better you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
              Latest Articles
            </h2>
            <Link
              href="/category/personal-growth"
              className="text-[var(--primary)] font-medium hover:underline flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Brain Games CTA */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                New Feature
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Train Your Brain with Fun Games
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-6">
                Challenge yourself with memory games, puzzles, and focus exercises.
                Earn points and track your progress!
              </p>
              <Link
                href="/games"
                className="inline-block px-8 py-3 bg-white text-[var(--primary)] rounded-full font-medium hover:bg-white/90 transition-colors"
              >
                Start Playing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
            Get Daily Motivation
          </h2>
          <p className="text-[var(--muted)] mb-8">
            Subscribe to receive daily quotes, articles, and growth tips delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-full border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-medium hover:bg-[var(--primary-dark)] transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-[var(--muted)] mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
