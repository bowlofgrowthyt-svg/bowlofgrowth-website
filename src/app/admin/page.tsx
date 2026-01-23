"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { name: "Personal Growth", slug: "personal-growth" },
  { name: "Productivity", slug: "productivity" },
  { name: "Emotional Intelligence", slug: "emotional-intelligence" },
  { name: "Book Summaries", slug: "book-summaries" },
  { name: "Success Stories", slug: "success-stories" },
  { name: "Career & Finance", slug: "career-finance" },
];

const suggestedTopics: Record<string, string[]> = {
  "Personal Growth": [
    "How to Build Unshakeable Self-Confidence",
    "The Power of Daily Affirmations",
    "Breaking Free from Limiting Beliefs",
    "How to Develop a Growth Mindset",
    "The Art of Self-Reflection",
    "Building Healthy Habits That Stick",
  ],
  "Productivity": [
    "The Pomodoro Technique: A Complete Guide",
    "How to Beat Procrastination Forever",
    "Morning Routines of Successful People",
    "Digital Minimalism for Better Focus",
    "Time Blocking: Plan Your Perfect Day",
    "The 80/20 Rule for Maximum Productivity",
  ],
  "Emotional Intelligence": [
    "Understanding Your Emotional Triggers",
    "How to Manage Anxiety Naturally",
    "The Art of Active Listening",
    "Building Emotional Resilience",
    "How to Handle Criticism Gracefully",
    "Developing Empathy in Relationships",
  ],
  "Book Summaries": [
    "Atomic Habits by James Clear - Key Takeaways",
    "The 7 Habits of Highly Effective People - Summary",
    "Think and Grow Rich - Essential Lessons",
    "The Power of Now by Eckhart Tolle - Summary",
    "Deep Work by Cal Newport - Key Insights",
    "Mindset by Carol Dweck - Complete Summary",
  ],
  "Success Stories": [
    "From Failure to Fortune: Inspiring Comeback Stories",
    "How Ordinary People Achieved Extraordinary Success",
    "Lessons from Self-Made Millionaires",
    "Stories of Resilience and Triumph",
    "People Who Changed Their Lives After 40",
    "From Rock Bottom to the Top",
  ],
  "Career & Finance": [
    "How to Negotiate Your Salary Like a Pro",
    "Building Multiple Income Streams",
    "The Basics of Investing for Beginners",
    "How to Find Your Dream Career",
    "Financial Mistakes to Avoid in Your 20s",
    "Building Wealth on Any Income",
  ],
};

// Generate Unsplash image URL based on topic keywords
function getTopicImage(topic: string, category: string): string {
  // Extract key words from topic for image search
  const searchTerms = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(" ")
    .filter((word) => word.length > 3 && !["how", "the", "and", "for", "with", "your", "that", "from", "what", "this", "complete", "guide", "summary", "key", "takeaways", "lessons", "insights"].includes(word))
    .slice(0, 3)
    .join(",");

  const categoryKeywords: Record<string, string> = {
    "Personal Growth": "growth,mindset,motivation",
    "Productivity": "productivity,workspace,focus",
    "Emotional Intelligence": "meditation,calm,mindfulness",
    "Book Summaries": "books,reading,library",
    "Success Stories": "success,achievement,celebration",
    "Career & Finance": "business,finance,career",
  };

  const fallback = categoryKeywords[category] || "inspiration,growth";
  const query = searchTerms || fallback;

  // Use different random seed for each topic to get different images
  const seed = topic.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return `https://images.unsplash.com/photo-${1500000000000 + (seed % 100000000)}?w=800&q=80&fit=crop`;
}

// Better approach: curated images per category with rotation
const categoryImageSets: Record<string, string[]> = {
  "Personal Growth": [
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
    "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800",
    "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800",
    "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800",
  ],
  "Productivity": [
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800",
    "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800",
  ],
  "Emotional Intelligence": [
    "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800",
    "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800",
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
    "https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800",
  ],
  "Book Summaries": [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
  ],
  "Success Stories": [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800",
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
  ],
  "Career & Finance": [
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800",
  ],
};

// Track used images to avoid duplicates
let usedImageIndices: Record<string, number> = {};

function getUniqueImage(category: string): string {
  const images = categoryImageSets[category] || categoryImageSets["Personal Growth"];
  const currentIndex = usedImageIndices[category] || 0;
  const image = images[currentIndex % images.length];
  usedImageIndices[category] = currentIndex + 1;
  return image;
}

interface BatchTopic {
  topic: string;
  category: string;
  categorySlug: string;
}

interface GeneratedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  image: string;
  author: string;
  readTime: number;
  createdAt: string;
  featured: boolean;
}

export default function AdminPage() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState(categories[0].name);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticles, setGeneratedArticles] = useState<GeneratedArticle[]>([]);
  const [error, setError] = useState("");
  const [currentGenerating, setCurrentGenerating] = useState("");
  const [batchTopics, setBatchTopics] = useState<BatchTopic[]>([]);
  const [batchMode, setBatchMode] = useState(false);

  const getCategorySlug = (catName: string) => {
    return categories.find((c) => c.name === catName)?.slug || "personal-growth";
  };

  const handleGenerate = async (topicToGenerate: string, cat: string) => {
    setCurrentGenerating(topicToGenerate);
    setError("");

    try {
      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicToGenerate, category: cat }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate article");
      }

      const article: GeneratedArticle = {
        ...data.article,
        id: String(Date.now() + Math.random()),
        image: getUniqueImage(cat),
        category: cat,
        categorySlug: getCategorySlug(cat),
        featured: generatedArticles.length === 0,
      };

      setGeneratedArticles((prev) => [...prev, article]);
      return article;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return null;
    }
  };

  const handleSingleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    setIsGenerating(true);
    await handleGenerate(topic, category);
    setIsGenerating(false);
    setTopic("");
  };

  const handleBatchGenerate = async () => {
    if (batchTopics.length === 0) {
      setError("Please add topics to generate");
      return;
    }
    setIsGenerating(true);
    // Reset image indices for fresh batch
    usedImageIndices = {};

    for (const item of batchTopics) {
      await handleGenerate(item.topic, item.category);
      // Small delay between requests
      await new Promise((r) => setTimeout(r, 1000));
    }

    setIsGenerating(false);
    setBatchTopics([]);
    setCurrentGenerating("");
  };

  const addToBatch = (t: string) => {
    if (!batchTopics.find((item) => item.topic === t)) {
      setBatchTopics([
        ...batchTopics,
        { topic: t, category: category, categorySlug: getCategorySlug(category) },
      ]);
    }
  };

  const removeFromBatch = (t: string) => {
    setBatchTopics(batchTopics.filter((item) => item.topic !== t));
  };

  const copyAllArticlesJSON = () => {
    const articlesCode = generatedArticles
      .map(
        (a) => `  {
    id: "${a.id}",
    title: "${a.title.replace(/"/g, '\\"')}",
    slug: "${a.slug}",
    excerpt: "${a.excerpt.replace(/"/g, '\\"')}",
    content: \`${a.content.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`,
    category: "${a.category}",
    categorySlug: "${a.categorySlug}",
    image: "${a.image}",
    author: "${a.author}",
    readTime: ${a.readTime},
    createdAt: "${a.createdAt}",
    featured: ${a.featured},
  }`
      )
      .join(",\n");

    navigator.clipboard.writeText(articlesCode);
    alert(`${generatedArticles.length} articles copied! Share with Claude to add to your site.`);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-6xl mx-auto px-4">
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
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Article Generator</h1>
          <p className="text-[var(--muted)]">Generate articles using Claude AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Generator */}
          <div className="space-y-6">
            {/* Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setBatchMode(false)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                  !batchMode
                    ? "bg-[var(--primary)] text-white"
                    : "bg-gray-100 text-[var(--muted)] hover:bg-gray-200"
                }`}
              >
                Single Article
              </button>
              <button
                onClick={() => setBatchMode(true)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                  batchMode
                    ? "bg-[var(--primary)] text-white"
                    : "bg-gray-100 text-[var(--muted)] hover:bg-gray-200"
                }`}
              >
                Batch Generate
              </button>
            </div>

            {/* Category Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Category {batchMode && <span className="text-[var(--muted)] font-normal">(for topics you add)</span>}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--primary)]"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Single Mode */}
            {!batchMode && (
              <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Article Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., How to build a morning routine that sticks"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] mb-4"
                />
                <button
                  onClick={handleSingleGenerate}
                  disabled={isGenerating}
                  className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
                >
                  {isGenerating ? `Generating: ${currentGenerating.slice(0, 30)}...` : "Generate Article"}
                </button>
              </div>
            )}

            {/* Batch Mode */}
            {batchMode && (
              <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[var(--foreground)]">
                    Batch Queue ({batchTopics.length} topics)
                  </h3>
                  {batchTopics.length > 0 && (
                    <button
                      onClick={() => setBatchTopics([])}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {batchTopics.length > 0 ? (
                  <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {batchTopics.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="truncate block">{item.topic}</span>
                          <span className="text-xs text-[var(--primary)]">{item.category}</span>
                        </div>
                        <button
                          onClick={() => removeFromBatch(item.topic)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--muted)] mb-4">
                    Select a category above, then add topics. Change category to add topics from different categories.
                  </p>
                )}

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Custom topic..."
                    className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && topic.trim()) {
                        addToBatch(topic.trim());
                        setTopic("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (topic.trim()) {
                        addToBatch(topic.trim());
                        setTopic("");
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <button
                  onClick={handleBatchGenerate}
                  disabled={isGenerating || batchTopics.length === 0}
                  className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
                >
                  {isGenerating
                    ? `Generating: ${currentGenerating.slice(0, 25)}...`
                    : `Generate ${batchTopics.length} Articles`}
                </button>
              </div>
            )}

            {/* Suggested Topics */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-3">
                Suggested Topics for {category}
              </h3>
              <div className="space-y-2">
                {suggestedTopics[category]?.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => (batchMode ? addToBatch(t) : setTopic(t))}
                    disabled={batchTopics.some((item) => item.topic === t)}
                    className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-[var(--secondary)] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                  >
                    <span>{t}</span>
                    {batchMode && (
                      <span className="text-[var(--primary)]">
                        {batchTopics.some((item) => item.topic === t) ? "Added" : "+ Add"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
            )}
          </div>

          {/* Right Column - Generated Articles */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  Generated Articles ({generatedArticles.length})
                </h2>
                {generatedArticles.length > 0 && (
                  <button
                    onClick={copyAllArticlesJSON}
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors"
                  >
                    Copy All
                  </button>
                )}
              </div>

              {generatedArticles.length === 0 ? (
                <div className="text-center py-12 text-[var(--muted)]">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p>No articles generated yet</p>
                  <p className="text-sm mt-1">Generate articles and they will appear here</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {generatedArticles.map((article) => (
                    <div
                      key={article.id}
                      className="border border-[var(--border)] rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={article.image}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-[var(--primary)] uppercase">
                              {article.category}
                            </span>
                            {article.featured && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <h4 className="font-medium text-[var(--foreground)] line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-[var(--muted)] mt-1">
                            {article.readTime} min read
                          </p>
                        </div>
                      </div>
                      <details className="mt-3">
                        <summary className="text-sm text-[var(--primary)] cursor-pointer hover:underline">
                          View content
                        </summary>
                        <div className="mt-2 bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-xs font-mono">
                            {article.content.slice(0, 500)}...
                          </pre>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {generatedArticles.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl">
                <h4 className="font-medium text-green-800 mb-2">Next Steps:</h4>
                <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                  <li>Click &quot;Copy All&quot; button above</li>
                  <li>Paste the copied code in this chat</li>
                  <li>Claude will add it to your site automatically!</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
