"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePos({ x, y });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollProgress = Math.min(scrollY / 600, 1);

  return (
    <section
      ref={heroRef}
      className="relative h-[100vh] min-h-[700px] overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Deep background layer */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e]"
        style={{
          transform: `translateY(${scrollY * 0.1}px) scale(${1 + scrollProgress * 0.1})`,
        }}
      />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 20}% ${50 + mousePos.y * 20}%, rgba(124, 58, 237, 0.4) 0%, transparent 50%)`,
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          transform: `translateY(${scrollY * 0.2}px) rotateX(${scrollProgress * 10}deg)`,
          transformOrigin: "center top",
        }}
      />

      {/* Floating orbs - Layer 1 (slow) */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)",
          top: "-200px",
          right: "-200px",
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20 + scrollY * 0.3}px) scale(${1 - scrollProgress * 0.2})`,
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
          bottom: "-100px",
          left: "-100px",
          transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30 - scrollY * 0.25}px)`,
          filter: "blur(30px)",
        }}
      />

      {/* Floating orbs - Layer 2 (medium) */}
      <div
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
          top: "30%",
          left: "10%",
          transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40 + scrollY * 0.4}px)`,
          filter: "blur(20px)",
        }}
      />
      <div
        className="absolute w-[150px] h-[150px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          top: "20%",
          right: "20%",
          transform: `translate(${mousePos.x * -50}px, ${mousePos.y * -50 + scrollY * 0.35}px)`,
          filter: "blur(15px)",
        }}
      />

      {/* Geometric shapes */}
      <div
        className="absolute w-24 h-24 border border-white/10 rounded-2xl"
        style={{
          top: "15%",
          left: "15%",
          transform: `rotate(${45 + scrollY * 0.1 + mousePos.x * 10}deg) translateY(${scrollY * 0.5}px) scale(${1 - scrollProgress * 0.3})`,
          opacity: 1 - scrollProgress,
        }}
      />
      <div
        className="absolute w-16 h-16 border border-white/10 rounded-full"
        style={{
          top: "25%",
          right: "25%",
          transform: `translateY(${scrollY * 0.6}px) scale(${1 + scrollProgress * 0.5})`,
          opacity: 1 - scrollProgress * 0.8,
        }}
      />
      <div
        className="absolute w-20 h-20 border border-purple-400/20 rounded-xl"
        style={{
          bottom: "30%",
          right: "10%",
          transform: `rotate(${-30 + scrollY * 0.05}deg) translateY(${scrollY * 0.45}px)`,
          opacity: 1 - scrollProgress,
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            top: `${15 + i * 15}%`,
            left: `${10 + i * 15}%`,
            transform: `translateY(${scrollY * (0.2 + i * 0.1)}px) translateX(${mousePos.x * (20 + i * 10)}px)`,
            opacity: (1 - scrollProgress) * (0.3 + i * 0.1),
          }}
        />
      ))}

      {/* Main content with 3D transform */}
      <div
        className="relative z-10 h-full flex items-center justify-center"
        style={{
          transform: `translateY(${-scrollY * 0.4}px) translateZ(${50 - scrollProgress * 50}px)`,
          opacity: 1 - scrollProgress * 1.2,
        }}
      >
        <div
          className="text-center text-white px-4 max-w-5xl mx-auto"
          style={{
            transform: `rotateX(${mousePos.y * 5}deg) rotateY(${mousePos.x * 5}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Tagline */}
          <div
            className="inline-block mb-6"
            style={{ transform: `translateZ(30px)` }}
          >
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-purple-200 border border-white/10">
              ✨ Simple Wisdom for a Meaningful Life
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight"
            style={{ transform: `translateZ(50px)` }}
          >
            <span className="block bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              Grow Every Day
            </span>
            <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 font-light text-purple-200">
              with Bowl of Growth
            </span>
          </h1>

          {/* Description */}
          <p
            className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ transform: `translateZ(20px)` }}
          >
            Discover daily inspiration, practical wisdom, and mindful strategies
            to transform your life one small step at a time.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ transform: `translateZ(40px)` }}
          >
            <Link
              href="#articles"
              className="group relative px-8 py-4 bg-white text-[var(--primary)] rounded-full font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              <span className="relative z-10">Start Reading</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/games"
              className="group px-8 py-4 bg-white/5 text-white border border-white/20 rounded-full font-semibold text-lg backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/40 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                🧠 Brain Games
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div
            className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
            style={{ transform: `translateZ(10px)` }}
          >
            {[
              { value: "Daily", label: "New Content" },
              { value: "Free", label: "Brain Games" },
              { value: "100+", label: "Articles" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 1 - scrollProgress * 3 }}
      >
        <span className="text-white/40 text-xs uppercase tracking-widest">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" />
    </section>
  );
}
