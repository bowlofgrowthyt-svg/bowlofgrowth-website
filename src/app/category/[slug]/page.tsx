import { categories } from "@/data/categories";
import { getArticlesByCategory, articles } from "@/data/articles";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryArticles = getArticlesByCategory(slug).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="fade-in">
      {/* Header */}
      <section className="bg-gradient-to-br from-[var(--secondary)] to-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: category.color + "20", color: category.color }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
                {category.name}
              </h1>
              <p className="text-[var(--muted)]">{category.articleCount} articles</p>
            </div>
          </div>

          <p className="text-lg text-[var(--muted)] max-w-2xl">
            {category.description}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--secondary)] flex items-center justify-center">
                <svg className="w-10 h-10 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">No articles yet</h3>
              <p className="text-[var(--muted)] mb-6">
                We're working on adding great content to this category. Check back soon!
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-2 bg-[var(--primary)] text-white rounded-full font-medium hover:bg-[var(--primary-dark)] transition-colors"
              >
                Explore Other Categories
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">
            Explore Other Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories
              .filter((c) => c.slug !== slug)
              .map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="px-5 py-2 bg-[var(--secondary)] text-[var(--foreground)] rounded-full font-medium hover:bg-[var(--primary)] hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
