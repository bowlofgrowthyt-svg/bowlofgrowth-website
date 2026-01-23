"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Newsletter() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Check localStorage for subscription status
  useEffect(() => {
    const subscribed = localStorage.getItem("newsletter_subscribed");
    if (subscribed) {
      setIsSubscribed(true);
    }
  }, []);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          userId: user?.id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setMessage(data.message);
      setIsSubscribed(true);
      localStorage.setItem("newsletter_subscribed", "true");
      localStorage.setItem("newsletter_email", email);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  // Already subscribed view
  if (isSubscribed) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            You're Subscribed! 🎉
          </h2>
          <p className="text-[var(--muted)]">
            Thank you for joining our community. Watch your inbox for daily wisdom and inspiration.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <span className="inline-block px-4 py-1 bg-[var(--secondary)] text-[var(--primary)] rounded-full text-sm font-medium mb-4">
          Join Our Community
        </span>
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
          Get Daily Wisdom in Your Inbox
        </h2>
        <p className="text-[var(--muted)] mb-8">
          Join thousands of readers receiving daily inspiration, practical tips, and mindful
          strategies to live a more meaningful life.
        </p>

        {status === "success" ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            <p className="font-medium">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user ? user.email || "Enter your email" : "Enter your email"}
              className="flex-1 px-5 py-4 rounded-full border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 disabled:bg-gray-50"
              required
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-4 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-500 text-sm mt-3">{message}</p>
        )}

        <p className="text-xs text-[var(--muted)] mt-4">
          No spam, ever. Unsubscribe anytime. Read our privacy policy.
        </p>

        {user && (
          <p className="text-xs text-[var(--primary)] mt-2">
            ✨ Signed in as {user.email}
          </p>
        )}
      </div>
    </section>
  );
}
