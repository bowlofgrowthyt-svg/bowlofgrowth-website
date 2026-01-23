"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getCategoriesWithCounts } from "@/data/categories";
import { getDailyQuote } from "@/data/quotes";
import QuoteCard from "./QuoteCard";

export default function Sidebar() {
  const [sidebarEmail, setSidebarEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [sidebarStatus, setSidebarStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Check localStorage on mount
  useEffect(() => {
    const subscribed = localStorage.getItem("newsletter_subscribed");
    if (subscribed === "true") {
      setIsSubscribed(true);
    }
  }, []);

  const handleSidebarSubscribe = async () => {
    if (!sidebarEmail || !sidebarEmail.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    setSidebarStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sidebarEmail }),
      });

      if (response.ok) {
        setSidebarStatus("success");
        setIsSubscribed(true);
        localStorage.setItem("newsletter_subscribed", "true");
        localStorage.setItem("newsletter_email", sidebarEmail);
      } else {
        setSidebarStatus("error");
      }
    } catch {
      setSidebarStatus("error");
    }
  };

  const handleUnsubscribe = () => {
    localStorage.removeItem("newsletter_subscribed");
    localStorage.removeItem("newsletter_email");
    setIsSubscribed(false);
    setSidebarStatus("idle");
    setSidebarEmail("");
  };
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
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Get Daily Wisdom</h3>
        {isSubscribed || sidebarStatus === "success" ? (
          <div className="text-center py-2">
            <span className="text-3xl">✅</span>
            <p className="font-medium mt-2">You&apos;re Subscribed!</p>
            <p className="text-white/70 text-sm mt-1">Thanks for joining our community.</p>
            <button
              type="button"
              onClick={handleUnsubscribe}
              className="mt-4 text-xs text-white/60 hover:text-white underline"
            >
              Unsubscribe
            </button>
          </div>
        ) : (
          <>
            <p className="text-white/80 text-sm mb-4">
              Join readers receiving daily inspiration in their inbox.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                value={sidebarEmail}
                onChange={(e) => setSidebarEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/50"
              />
              <button
                type="button"
                onClick={handleSidebarSubscribe}
                disabled={sidebarStatus === "loading"}
                className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold text-sm hover:bg-purple-50 transition-colors disabled:opacity-50"
              >
                {sidebarStatus === "loading" ? "Subscribing..." : "Subscribe Free"}
              </button>
            </div>
            <p className="text-xs text-white/60 mt-3 text-center">
              No spam, ever. Unsubscribe anytime.
            </p>
          </>
        )}
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
