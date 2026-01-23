import ArticleCard from "@/components/ArticleCard";
import CategoryCard from "@/components/CategoryCard";
import ParallaxHero from "@/components/ParallaxHero";
import Sidebar from "@/components/Sidebar";
import Newsletter from "@/components/Newsletter";
import { getCategoriesWithCounts } from "@/data/categories";
import { getFeaturedArticle, getRecentArticles } from "@/data/articles";
import Link from "next/link";

export default function Home() {
  const featuredArticle = getFeaturedArticle();
  const recentArticles = getRecentArticles(9);
  const categoriesWithCounts = getCategoriesWithCounts();

  return (
    <div>
      {/* Parallax Hero */}
      <ParallaxHero />

      {/* Main Content Area */}
      <div id="articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Article */}
            {featuredArticle && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center">
                    ⭐
                  </span>
                  <h2 className="text-2xl font-bold text-[var(--foreground)]">
                    Featured Article
                  </h2>
                </div>
                <ArticleCard article={featuredArticle} featured />
              </section>
            )}

            {/* Latest Articles */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-xl bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center">
                    📖
                  </span>
                  <h2 className="text-2xl font-bold text-[var(--foreground)]">
                    Latest Articles
                  </h2>
                </div>
                {recentArticles.length > 0 && (
                  <Link
                    href="/category/personal-growth"
                    className="text-[var(--primary)] font-medium hover:underline flex items-center gap-1"
                  >
                    View All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>

              {/* Article Grid */}
              {recentArticles.length > 0 ? (
                <div className="space-y-6">
                  {recentArticles.map((article) => (
                    <article
                      key={article.id}
                      className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl p-4 shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow"
                    >
                      <Link
                        href={`/articles/${article.slug}`}
                        className="sm:w-48 sm:h-32 h-48 flex-shrink-0 rounded-lg overflow-hidden relative"
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="flex-1 flex flex-col justify-center">
                        <Link
                          href={`/category/${article.categorySlug}`}
                          className="text-[var(--primary)] text-xs font-medium uppercase tracking-wide mb-1 hover:underline"
                        >
                          {article.category}
                        </Link>
                        <Link href={`/articles/${article.slug}`}>
                          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 hover:text-[var(--primary)] transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-[var(--muted)] line-clamp-2 mb-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                          <span>{article.author}</span>
                          <span>•</span>
                          <span>{article.readTime} min read</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center">
                  <div className="w-16 h-16 bg-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                    Fresh Start
                  </h3>
                  <p className="text-[var(--muted)] mb-6">
                    New articles are on the way. Check back soon for inspiring content!
                  </p>
                  <Link
                    href="/games"
                    className="inline-block px-6 py-3 bg-[var(--primary)] text-white rounded-full font-medium hover:bg-[var(--primary-dark)] transition-colors"
                  >
                    Play Brain Games While You Wait
                  </Link>
                </div>
              )}

              {/* Load More Button */}
              {recentArticles.length > 6 && (
                <div className="text-center mt-8">
                  <Link
                    href="/category/personal-growth"
                    className="inline-block px-8 py-3 bg-[var(--secondary)] text-[var(--primary)] rounded-full font-medium hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    Load More Articles
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Categories Section - Full Width */}
      <section className="bg-[var(--secondary)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              Explore by Topic
            </h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">
              Find the wisdom you need in our carefully curated categories.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesWithCounts.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Quote Section */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600')",
          }}
        />
        <div className="absolute inset-0 bg-[var(--primary)]/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <svg
            className="w-16 h-16 mx-auto mb-6 opacity-50"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-2xl md:text-4xl font-light leading-relaxed mb-6">
            &ldquo;The journey of a thousand miles begins with one step.&rdquo;
          </blockquote>
          <cite className="text-lg text-white/80">— Lao Tzu</cite>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}
