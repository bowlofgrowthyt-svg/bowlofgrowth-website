import { getArticleBySlug, articles } from "@/data/articles";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import ShareButton from "@/components/ShareButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="fade-in">
      {/* Hero */}
      <div className="relative h-[40vh] md:h-[50vh] bg-[var(--foreground)]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--foreground)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <Link
              href={`/category/${article.categorySlug}`}
              className="inline-block px-4 py-1 bg-[var(--primary)] text-white text-sm font-medium rounded-full mb-4 hover:bg-[var(--primary-dark)] transition-colors"
            >
              {article.category}
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80">
              <span>{article.author}</span>
              <span>•</span>
              <span>{article.readTime} min read</span>
              <span>•</span>
              <span>{new Date(article.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6 md:p-10">
          <div
            className="prose prose-lg max-w-none prose-headings:text-[var(--foreground)] prose-p:text-[var(--muted)] prose-a:text-[var(--primary)] prose-strong:text-[var(--foreground)]"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br />") }}
          />
        </div>

        {/* Share & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-6 bg-[var(--secondary)] rounded-xl">
          <div>
            <p className="text-[var(--foreground)] font-medium">Enjoyed this article?</p>
            <p className="text-[var(--muted)] text-sm">Share it with others who might find it helpful.</p>
          </div>
          <div className="flex gap-3">
            <ShareButton title={article.title} />
            <Link
              href="/category/personal-growth"
              className="px-5 py-2 bg-white text-[var(--primary)] rounded-full text-sm font-medium border border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              More Articles
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </article>
  );
}
