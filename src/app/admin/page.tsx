"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  "Personal Growth",
  "Productivity",
  "Emotional Intelligence",
  "Book Summaries",
  "Success Stories",
  "Career & Finance",
];

interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  category: string;
  readTime: number;
}

export default function AdminPage() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedArticle(null);

    try {
      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate article");
      }

      setGeneratedArticle(data.article);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Site
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Admin Panel</h1>
          <p className="text-[var(--muted)]">Generate articles using Claude AI</p>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6 mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            AI Article Generator
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Article Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to build a morning routine that sticks"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating with Claude AI...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Article
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Article Preview */}
        {generatedArticle && (
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Generated Article
              </h2>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                Ready to publish
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] uppercase mb-1">
                  Title
                </label>
                <p className="text-lg font-semibold text-[var(--foreground)]">
                  {generatedArticle.title}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--muted)] uppercase mb-1">
                  Excerpt
                </label>
                <p className="text-[var(--muted)]">{generatedArticle.excerpt}</p>
              </div>

              <div className="flex gap-4 text-sm text-[var(--muted)]">
                <span>Category: {generatedArticle.category}</span>
                <span>•</span>
                <span>{generatedArticle.readTime} min read</span>
                <span>•</span>
                <span>Slug: {generatedArticle.slug}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--muted)] uppercase mb-1">
                  Content Preview
                </label>
                <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-[var(--foreground)] font-mono">
                    {generatedArticle.content}
                  </pre>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
                <button className="flex-1 py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-colors">
                  Save to Database
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(generatedArticle, null, 2));
                    alert("Article JSON copied to clipboard!");
                  }}
                  className="px-6 py-3 bg-gray-100 text-[var(--foreground)] rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Copy JSON
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-6 bg-[var(--secondary)] rounded-xl">
          <h3 className="font-semibold text-[var(--foreground)] mb-2">Setup Instructions</h3>
          <ol className="text-sm text-[var(--muted)] space-y-2 list-decimal list-inside">
            <li>Copy <code className="bg-white px-1 rounded">.env.example</code> to <code className="bg-white px-1 rounded">.env.local</code></li>
            <li>Add your Claude API key from <a href="https://console.anthropic.com/" target="_blank" className="text-[var(--primary)] hover:underline">console.anthropic.com</a></li>
            <li>Restart the development server</li>
            <li>Generated articles will need to be saved to your database (Supabase setup coming next)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
