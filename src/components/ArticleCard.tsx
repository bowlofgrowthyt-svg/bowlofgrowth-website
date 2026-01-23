import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--border)] hover-lift"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-full">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-[var(--primary)] text-white text-xs font-medium rounded-full">
                Featured
              </span>
            </div>
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <span className="text-[var(--primary)] text-sm font-medium mb-2">
              {article.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--primary)] transition-colors">
              {article.title}
            </h2>
            <p className="text-[var(--muted)] mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
              <span>{article.author}</span>
              <span>•</span>
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-[var(--border)] hover-lift"
    >
      <div className="relative h-48">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <span className="text-[var(--primary)] text-xs font-medium">
          {article.category}
        </span>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mt-1 mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-[var(--muted)] text-sm line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>{article.author}</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
