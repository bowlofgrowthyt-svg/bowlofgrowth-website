"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background layers with parallax */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-[#5B21B6] to-[#1E1B4B]"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />

      {/* Decorative shapes */}
      <div
        className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl"
        style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.4}px)` }}
      />

      {/* Floating elements */}
      <div
        className="absolute top-32 right-20 text-6xl opacity-20"
        style={{ transform: `translateY(${scrollY * 0.6}px)` }}
      >
        ✨
      </div>
      <div
        className="absolute bottom-40 left-20 text-5xl opacity-20"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      >
        🌱
      </div>
      <div
        className="absolute top-1/2 right-1/4 text-4xl opacity-15"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        💡
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <p
            className="text-lg md:text-xl mb-4 text-purple-200 font-medium"
            style={{ transform: `translateY(${-scrollY * 0.1}px)`, opacity: 1 - scrollY / 500 }}
          >
            Simple Wisdom for a Meaningful Life
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ transform: `translateY(${-scrollY * 0.15}px)`, opacity: 1 - scrollY / 600 }}
          >
            Grow Every Day with
            <span className="block text-purple-200">Bowl of Growth</span>
          </h1>
          <p
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            style={{ transform: `translateY(${-scrollY * 0.2}px)`, opacity: 1 - scrollY / 700 }}
          >
            Discover daily inspiration, practical wisdom, and mindful strategies
            to transform your life one small step at a time.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ transform: `translateY(${-scrollY * 0.25}px)`, opacity: 1 - scrollY / 800 }}
          >
            <Link
              href="#articles"
              className="px-8 py-4 bg-white text-[var(--primary)] rounded-full font-semibold text-lg hover:bg-purple-50 transition-all hover:scale-105 shadow-lg"
            >
              Start Reading
            </Link>
            <Link
              href="/games"
              className="px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Brain Games
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce"
        style={{ opacity: 1 - scrollY / 200 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
