import Link from "next/link";

export const metadata = {
  title: "About Us",
  description: "Learn about Bowl of Growth - your daily dose of self-improvement and personal growth.",
};

export default function AboutPage() {
  return (
    <div className="min-h-[80vh] py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Bowl of Growth</h1>

        <div className="prose prose-lg text-gray-600">
          <p className="text-xl mb-6">
            Welcome to Bowl of Growth - your daily companion on the journey of self-improvement and personal development.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p>
            We believe that personal growth should be accessible to everyone. Our mission is to provide
            high-quality, actionable content that helps you become the best version of yourself.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Offer</h2>
          <ul className="space-y-2">
            <li><strong>Daily Articles</strong> - Thoughtful pieces on productivity, mindset, and personal development</li>
            <li><strong>Book Summaries</strong> - Key insights from the best self-help and business books</li>
            <li><strong>Brain Games</strong> - Fun exercises to sharpen your mind and boost cognitive abilities</li>
            <li><strong>Daily Inspiration</strong> - Quotes and wisdom to start your day right</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Join Our Community</h2>
          <p>
            Subscribe to our newsletter and join thousands of readers who are committed to continuous growth
            and self-improvement.
          </p>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
          >
            Start Reading
          </Link>
        </div>
      </div>
    </div>
  );
}
