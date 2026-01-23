import Link from "next/link";
import { getArticlesByCategory } from "@/data/articles";

export const metadata = {
  title: "Book Summaries",
  description: "Key insights and summaries from the best self-help, business, and personal development books.",
};

export default function BookSummariesPage() {
  const articles = getArticlesByCategory("book-summaries").sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-[80vh] py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
            Book Summaries
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Key Insights from Great Books
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don&apos;t have time to read? Get the essential takeaways from bestselling
            self-help, business, and personal development books in minutes.
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="space-y-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/articles/${article.slug}`}
                  className="sm:w-48 sm:h-32 h-48 flex-shrink-0 rounded-lg overflow-hidden"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-center">
                  <Link href={`/articles/${article.slug}`}>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-3xl">📚</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              We&apos;re working on bringing you the best book summaries. Check back soon!
            </p>
            <Link
              href="/category/personal-growth"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
            >
              Browse Articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
